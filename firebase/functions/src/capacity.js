"use strict";
// Cupos diarios de descarga, lista de espera e invitaciones de un solo uso (24 h).
const crypto = require("crypto");
const C = require("./config");
const { dayKey, addHours } = require("./util");

const capRef = (db, day = dayKey()) => db.collection("capacity").doc(day);

// Intenta tomar un cupo de hoy. Respeta 100 cupos/día y 400 activos/día (solo pruebas nuevas).
async function tryTakeSlot(db, tx) {
  const ref = capRef(db);
  const snap = await tx.get(ref);
  const d = snap.exists ? snap.data() : { slotsUsed: 0, activeUsers: 0 };
  if ((d.slotsUsed || 0) >= C.DAILY_DOWNLOAD_SLOTS) return false;
  if ((d.activeUsers || 0) >= C.MAX_DAILY_ACTIVE) return false;
  tx.set(ref, { slotsUsed: (d.slotsUsed || 0) + 1 }, { merge: true });
  return true;
}

function newInvite(db, tx, waitId, entry) {
  const token = crypto.randomBytes(24).toString("base64url");
  const now = new Date();
  tx.set(db.collection("invites").doc(token), {
    waitId, status: "pending", createdAt: now, expiresAt: addHours(now, C.INVITE_TTL_HOURS),
  });
  tx.update(db.collection("waitlist").doc(waitId), { status: "invited", invitedAt: now, token });
  const link = `${process.env.PUBLIC_BASE_URL}/descarga.html?invite=${token}`;
  // Aviso por la red de origen (o mail/WhatsApp). Lo envía un proceso aparte que lee `outbox`.
  tx.set(db.collection("outbox").doc(), {
    to: entry.contact, network: entry.network, kind: "invite", link, createdAt: now, sent: false,
  });
  return token;
}

// Entrega cupos libres de hoy a los siguientes de la fila.
async function promoteWaitlist(db, max = C.DAILY_DOWNLOAD_SLOTS) {
  let given = 0;
  while (given < max) {
    const q = await db.collection("waitlist").where("status", "==", "waiting").orderBy("createdAt").limit(1).get();
    if (q.empty) break;
    const doc = q.docs[0];
    const ok = await db.runTransaction(async (tx) => {
      const fresh = await tx.get(doc.ref);
      if (fresh.data().status !== "waiting") return null;
      if (!(await tryTakeSlot(db, tx))) return false;
      newInvite(db, tx, doc.id, fresh.data());
      return true;
    });
    if (ok === false) break;
    if (ok) given++;
  }
  return given;
}

// Vence invitaciones sin usar: libera el cupo y pasa al siguiente.
async function expireInvites(db) {
  const now = new Date();
  const q = await db.collection("invites").where("status", "==", "pending").where("expiresAt", "<=", now).get();
  for (const d of q.docs) {
    await db.runTransaction(async (tx) => {
      tx.update(d.ref, { status: "expired" });
      tx.update(db.collection("waitlist").doc(d.data().waitId), { status: "expired" });
      const ref = capRef(db, dayKey(d.data().createdAt.toDate()));
      const s = await tx.get(ref);
      if (s.exists && s.data().slotsUsed > 0 && ref.id === dayKey()) tx.update(ref, { slotsUsed: s.data().slotsUsed - 1 });
    });
  }
  return q.size;
}

// Cuenta usuarios activos del día (uno por uid).
async function markActive(db, uid) {
  const day = dayKey();
  const ref = db.collection("capacity").doc(day).collection("active").doc(uid);
  await db.runTransaction(async (tx) => {
    if ((await tx.get(ref)).exists) return;
    const cap = await tx.get(capRef(db, day));
    tx.set(ref, { at: new Date() });
    tx.set(capRef(db, day), { activeUsers: ((cap.exists && cap.data().activeUsers) || 0) + 1 }, { merge: true });
  });
}
module.exports = { tryTakeSlot, newInvite, promoteWaitlist, expireInvites, markActive, capRef };
