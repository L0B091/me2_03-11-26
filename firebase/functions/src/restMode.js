"use strict";
// Modo reposo: sin IA. Reofrece el link ante cualquier input; si dice sí pregunta el plan.
const C = require("./config");
const { norm } = require("./util");

const YES = /^(si|sí|dale|ok|okay|bueno|quiero|de una|claro|genera|pasame|mandame)\b/;
const NO = /^(no|nop|despues|mas tarde|ahora no|todavia no)\b/;

function pickPlan(t) {
  if (/\b(full|adulto|8000|premium)\b/.test(t)) return "full";
  if (/\b(basico|base|4000)\b/.test(t)) return "basico";
  return null;
}

// stage: "offer" (se ofreció link) | "ask_plan" (se preguntó plan)
function restReply(text, stage, counter, channel) {
  const t = norm(text);
  const variant = C.REST_REPLIES[counter % C.REST_REPLIES.length];
  if (stage === "ask_plan") {
    const plan = pickPlan(t);
    if (plan) return { action: "checkout", plan, nextStage: "offer" };
    if (NO.test(t)) return { reply: C.REST_NO, nextStage: "offer" };
    // Desvío o respuesta ambigua: vuelve a ofrecer
    return { reply: variant, nextStage: "offer" };
  }
  const direct = pickPlan(t);
  if (YES.test(t) && direct) return { action: "checkout", plan: direct, nextStage: "offer" };
  if (YES.test(t)) return { reply: channel === "play" ? C.REST_ASK_PLAN_PLAY : C.REST_ASK_PLAN, nextStage: "ask_plan" };
  if (NO.test(t)) return { reply: C.REST_NO, nextStage: "offer" };
  return { reply: variant, nextStage: "offer" };
}
module.exports = { restReply, pickPlan };
