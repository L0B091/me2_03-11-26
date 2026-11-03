"use strict";
// Estado de acceso de un usuario: trial | paid | rest
const C = require("./config");
const { toDate } = require("./util");

function accessState(user, now = new Date()) {
  const planUntil = toDate(user.planExpiresAt);
  if (user.plan && planUntil && planUntil > now) {
    const p = C.PLANS[user.plan];
    return { state: "paid", plan: p.id, priority: p.priority,
      adult: p.adult && user.ageVerified === true && user.channel === "apk", // adulto nunca en Play
      cap: C.PAID_MSG_CAP_PER_DAY, capScope: "day" };
  }
  const trialUntil = toDate(user.trialEndsAt);
  if (trialUntil && trialUntil > now) {
    return { state: "trial", plan: null, priority: "normal", adult: false, cap: C.TRIAL_MSG_CAP, capScope: "trial" };
  }
  return { state: "rest", plan: null, priority: null, adult: false, cap: 0 };
}
module.exports = { accessState };
