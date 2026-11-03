"use strict";
// ME2 Cloud Functions. Requieren plan Blaze para desplegarse (ver ../README_BLAZE.md).
const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");
const C = require("./src/config");
const { dayKey, addHours } = require("./src/util");
const { accessState } = require("./src/access");
const { restReply } = require("./src/restMode");
const { callLocalAI } = require("./src/ai");
const cap = require("./src/capacity");
const mp = require("./src/mercadopago");

admin.initializeApp();
const db = admin.firestore();
setGlobalOptions({ region: "southamerica-east1", maxInstances: 5 });

const MP_ACCESS_TOKEN = defineSecret("MP_ACCESS_TOKEN");
const MP_WEBHOOK_SECRET = defineSecret("MP_WEBHOOK_SECRET");
const LOCAL_AI_KEY = defineSecret("LOCAL_AI_KEY");
const webhookUrl = () => `https://southamerica-east1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/mpWebhook`;
const needAuth = (req) => { if (!req.auth) throw new HttpsError("unauthenticated", "Iniciá sesión"); return req.auth.uid; };
const channelOf = (c) => (c === "apk" ? "apk" : "play");

// --- Lista de espera (web pública) ---
exports.joinWaitlist = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  const { network, contact } = req.body || {};
  if (!/^(instagram|tiktok|facebook|x|email|whatsapp)$/.test(network || "") || !contact || String(contact).length > 120)
    return res.status(400).json({ error: "datos inválidos" });
  const ref = db.collection("waitlist").doc();
  await ref.set({ network, contact: String(contact), status: "waiting", createdAt: new Date() });
  const given = await cap.promoteWaitlist(db, 1);
  const s = (await ref.get()).data().status;
  res.json({ status: s === "invited" ? "invited" : "waiting", promoted: given });
});

// La página de descarga valida el token antes de mostrar la APK.
exports.checkInvite = onRequest({ cors: true }, async (req, res) => {
  const t = String(req.query.invite || "");
  const d = t && (await db.collection("invites").doc(t).get());
  const ok = d && d.exists && d.data().status === "pending" && d.data().expiresAt.toDate() > new Date();
  res.json({ valid: !!ok });
});

// --- Alta de la prueba de 24 h (consume la invitación, un solo uso) ---
exports.startTrial = onCall(async (req) => {
  const uid = needAuth(req);
  const token = String(req.data?.invite || "");
  const channel = channelOf(req.data?.channel);
  const uRef = db.collection("users").doc(uid);
  return db.runTransaction(async (tx) => {
    const u = await tx.get(uRef);
    if (u.exists && u.data().trialEndsAt) return { ok: true, already: true }; // una prueba por cuenta
    const iRef = db.collection("invites").doc(token);
    const inv = token ? await tx.get(iRef) : null;
    if (!inv || !inv.exists || inv.data().status !== "pending" || inv.data().expiresAt.toDate() <= new Date())
      throw new HttpsError("failed-precondition", "Invitación inválida o vencida");
    const now = new Date();
    tx.update(iRef, { status: "used", usedBy: uid, usedAt: now });
    tx.update(db.collection("waitlist").doc(inv.data().waitId), { status: "used" });
    tx.set(uRef, { trialStartedAt: now, trialEndsAt: addHours(now, C.TRIAL_HOURS), trialMsgCount: 0,
      plan: null, planExpiresAt: null, ageVerified: false, channel, restStage: "offer", restCounter: 0 }, { merge: true });
    return { ok: true, trialEndsAt: addHours(now, C.TRIAL_HOURS).toISOString() };
  });
});

// --- Checkout Mercado Pago ---
async function checkout(uid, plan) {
  const u = (await db.collection("users").doc(uid).get()).data() || {};
  if (!C.PLANS[plan]) throw new HttpsError("invalid-argument", "Plan inválido");
  if (C.PLANS[plan].needsAgeCheck && u.ageVerified !== true) return { needsAgeCheck: true, reply: C.REST_AGE_FIRST };
  const { url } = await mp.createPreference({ uid, plan, token: MP_ACCESS_TOKEN.value(), webhookUrl: webhookUrl() });
  return { url, plan };
}
exports.createCheckout = onCall({ secrets: [MP_ACCESS_TOKEN] }, async (req) => checkout(needAuth(req), req.data?.plan));

exports.mpWebhook = onRequest({ secrets: [MP_ACCESS_TOKEN, MP_WEBHOOK_SECRET] }, async (req, res) => {
  if (!mp.verifySignature(req, MP_WEBHOOK_SECRET.value())) return res.status(401).end();
  const type = req.query.type || req.body?.type;
  const id = req.query["data.id"] || req.body?.data?.id;
  if (type !== "payment" || !id) return res.status(200).end();
  try {
    const pay = await mp.fetchPayment(id, MP_ACCESS_TOKEN.value());
    const r = await mp.applyPayment(db, pay);
    res.status(200).json({ result: r });
  } catch (e) { console.error("mpWebhook", e.message); res.status(500).end(); }
});

// --- Chat ---
exports.chat = onCall({ secrets: [MP_ACCESS_TOKEN, LOCAL_AI_KEY], timeoutSeconds: 60 }, async (req) => {
  const uid = needAuth(req);
  const text = String(req.data?.text || "").slice(0, 2000);
  const history = Array.isArray(req.data?.history) ? req.data.history.slice(-12) : [];
  const uRef = db.collection("users").doc(uid);
  const u = (await uRef.get()).data() || {};
  const acc = accessState(u);

  if (acc.state === "rest") {           // sin IA, costo cero
    const r = restReply(text, u.restStage || "offer", u.restCounter || 0, u.channel);
    await uRef.update({ restStage: r.nextStage, restCounter: admin.firestore.FieldValue.increment(1) });
    if (r.action === "checkout") return { state: "rest", ...(await checkout(uid, r.plan)) };
    return { state: "rest", reply: r.reply };
  }

  // Tope de mensajes: 300 en la prueba, 300 por día en planes pagos.
  const usageRef = acc.capScope === "trial" ? uRef : db.collection("usage").doc(`${uid}_${dayKey()}`);
  const field = acc.capScope === "trial" ? "trialMsgCount" : "count";
  const allowed = await db.runTransaction(async (tx) => {
    const s = await tx.get(usageRef);
    const n = (s.exists && s.data()[field]) || 0;
    if (n >= acc.cap) return false;
    tx.set(usageRef, { [field]: n + 1 }, { merge: true });
    return true;
  });
  if (!allowed) return { state: acc.state, limited: true, reply: C.LIMIT_REPLY };
  await cap.markActive(db, uid);

  const mem = await uRef.collection("memories").orderBy("createdAt", "desc").limit(20).get();
  const memText = mem.docs.map((d) => `- ${d.data().text}`).join("\n");
  const system = [
    "Sos ME2, compañera virtual. Tono semi formal, con complicidad en segundo plano.",
    acc.adult ? "Modo adulto habilitado (usuario verificado +18, APK propia)." : "Sin contenido sexual.",
    memText ? `Lo que recordás del usuario:\n${memText}` : "",
  ].filter(Boolean).join("\n");
  const ai = await callLocalAI({ messages: [{ role: "system", content: system }, ...history, { role: "user", content: text }],
    priority: acc.priority }, LOCAL_AI_KEY.value());
  if (ai.offline) return { state: "offline", reply: C.OFFLINE_REPLY };
  return { state: acc.state, plan: acc.plan, reply: ai.text };
});

// --- Tareas programadas ---
exports.expireInvitesJob = onSchedule({ schedule: "every 30 minutes", timeZone: C.TZ }, async () => {
  await cap.expireInvites(db);
  await cap.promoteWaitlist(db);
});
exports.dailySlotsJob = onSchedule({ schedule: "5 0 * * *", timeZone: C.TZ }, async () => {
  await cap.promoteWaitlist(db); // abre los 100 cupos del día nuevo
});
// Nota: las memorias (users/{uid}/memories) nunca se borran al terminar la prueba.
