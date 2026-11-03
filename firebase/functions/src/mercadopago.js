"use strict";
// Mercado Pago: preferencia de pago y webhook con verificación de firma. Sin débito automático.
const crypto = require("crypto");
const C = require("./config");
const { addDays, toDate } = require("./util");
const MP = "https://api.mercadopago.com";

async function createPreference({ uid, plan, token, webhookUrl }) {
  const p = C.PLANS[plan];
  const ref = `${uid}:${plan}:${crypto.randomBytes(6).toString("hex")}`;
  const r = await fetch(`${MP}/checkout/preferences`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      items: [{ id: p.id, title: `${p.title} (30 días)`, quantity: 1, unit_price: p.price, currency_id: p.currency }],
      external_reference: ref, notification_url: webhookUrl,
      back_urls: { success: `${process.env.PUBLIC_BASE_URL}/gracias.html`, failure: `${process.env.PUBLIC_BASE_URL}/`, pending: `${process.env.PUBLIC_BASE_URL}/` },
    }),
  });
  if (!r.ok) throw new Error(`MP preference HTTP ${r.status}`);
  const j = await r.json();
  return { url: j.init_point, ref };
}

// x-signature: "ts=...,v1=..." ; manifest "id:{data.id};request-id:{x-request-id};ts:{ts};"
function verifySignature(req, secret) {
  const sig = String(req.get("x-signature") || "");
  const parts = Object.fromEntries(sig.split(",").map((s) => s.trim().split("=")));
  const dataId = String(req.query["data.id"] || req.body?.data?.id || "").toLowerCase();
  if (!parts.ts || !parts.v1 || !dataId) return false;
  const manifest = `id:${dataId};request-id:${req.get("x-request-id") || ""};ts:${parts.ts};`;
  const h = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
  return h.length === parts.v1.length && crypto.timingSafeEqual(Buffer.from(h), Buffer.from(parts.v1));
}

async function fetchPayment(id, token) {
  const r = await fetch(`${MP}/v1/payments/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) throw new Error(`MP payment HTTP ${r.status}`);
  return r.json();
}

// Acredita 30 días apilables. Idempotente por paymentId.
async function applyPayment(db, pay) {
  if (pay.status !== "approved") return "ignored";
  const [uid, plan] = String(pay.external_reference || "").split(":");
  const p = C.PLANS[plan];
  if (!uid || !p) return "bad_reference";
  if (Number(pay.transaction_amount) < p.price || pay.currency_id !== p.currency) return "bad_amount";
  return db.runTransaction(async (tx) => {
    const payRef = db.collection("payments").doc(String(pay.id));
    if ((await tx.get(payRef)).exists) return "duplicate";
    const uRef = db.collection("users").doc(uid);
    const u = (await tx.get(uRef)).data() || {};
    if (p.needsAgeCheck && u.ageVerified !== true) {
      tx.set(payRef, { uid, plan, status: "held_age_check", at: new Date() }); // para reembolso manual
      return "age_check_required";
    }
    const now = new Date();
    const cur = toDate(u.planExpiresAt);
    const base = cur && cur > now ? cur : now;            // apilado
    const keepFull = u.plan === "full" && cur && cur > now; // no baja de Full a Básico mientras dure
    tx.set(uRef, { plan: keepFull ? "full" : plan, planExpiresAt: addDays(base, C.PLAN_DAYS), restStage: "offer" }, { merge: true });
    tx.set(payRef, { uid, plan, amount: pay.transaction_amount, status: "credited", at: now });
    return "credited";
  });
}
module.exports = { createPreference, verifySignature, fetchPayment, applyPayment };
