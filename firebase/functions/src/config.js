"use strict";
// Reglas de negocio de ME2 (definidas por Emanuel). Cambiar acá, no en el código.
module.exports = {
  TZ: "America/Argentina/Buenos_Aires",
  TRIAL_HOURS: 24,
  TRIAL_MSG_CAP: 300,          // tope total durante la prueba
  PAID_MSG_CAP_PER_DAY: 300,   // tope diario en planes pagos
  PLAN_DAYS: 30,
  PLANS: {
    basico: { id: "basico", title: "ME2 Básico", price: 4000, currency: "ARS", priority: "normal", adult: false, needsAgeCheck: false },
    full:   { id: "full",   title: "ME2 Full",   price: 8000, currency: "ARS", priority: "high",   adult: true,  needsAgeCheck: true },
  },
  DAILY_DOWNLOAD_SLOTS: 100,
  MAX_DAILY_ACTIVE: 400,       // solo frena pruebas nuevas, nunca a los que pagan
  INVITE_TTL_HOURS: 24,
  REST_REPLIES: [
    "El modelo está en modo reposo hasta que renueves tu suscripción. ¿Querés que te genere un link de pago?",
    "Estoy en modo reposo hasta que se renueve tu suscripción. ¿Te genero el link de pago?",
    "Por ahora estoy en reposo. Si renovás tu suscripción, seguimos. ¿Te paso el link de pago?",
    "Tu suscripción venció y el modelo quedó en reposo. ¿Querés que te genere el link para renovarla?",
  ],
  REST_ASK_PLAN: "¿A qué plan te querés suscribir? Básico ($4000, 30 días) o Full ($8000, 30 días, galería extendida, requiere verificación de edad).",
  REST_ASK_PLAN_PLAY: "¿A qué plan te querés suscribir? Básico ($4000, 30 días) o Full ($8000, 30 días, galería extendida).",
  REST_NO: "Cuando quieras renovar, avisame",
  REST_AGE_FIRST: "Para el plan Full primero tenés que pasar la verificación de edad. Te dejo el enlace en la app.",
  OFFLINE_REPLY: "Estoy en mantenimiento, vuelvo en un rato.",
  LIMIT_REPLY: "Llegaste al tope de mensajes de hoy. Mañana seguimos.",
};
