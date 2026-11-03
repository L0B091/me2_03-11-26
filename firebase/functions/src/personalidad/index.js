"use strict";
// Personalidad fija + línea de estado + filtro de salida. Compartido por backend (ESM) y Functions (CJS).
const fs = require("fs");
const path = require("path");

const NOMBRES_INTENSIDAD = { 1: "cercania_amable", 2: "complicidad_ligera", 3: "complicidad_sugerida",
  4: "cercania_emocional", 5: "calidez_alta", 6: "contencion", 7: "reposo_consciente" };
const ENUMS = {
  etapa: ["exploratoria", "familiaridad", "recuerdos", "confianza"],
  ritmo: ["lento", "medio", "alto"], energia_social: ["baja", "media", "alta"],
  regulacion: ["estable", "activa"],
  usuario_emocion: ["neutral", "alegria", "tristeza", "enojo", "cansancio"],
  momento: ["activo", "reposo_nocturno"], propuesta: ["no", "ligera", "directa", "cita"],
};
const DEFAULTS = { etapa: "exploratoria", ritmo: "medio", energia_social: "media", regulacion: "estable",
  usuario_emocion: "neutral", momento: "activo", propuesta: "no" };

let promptCache = null;
function promptBase() {
  if (promptCache == null) promptCache = fs.readFileSync(path.resolve(__dirname, "promptFijo.txt"), "utf8").trim();
  return promptCache;
}
function nombrePorDefecto() { return (process.env.PERSONAJE_NOMBRE || "").trim() || "ME2"; }
function buildSystemPrompt({ nombre } = {}) {
  const n = (nombre && String(nombre).trim()) || nombrePorDefecto();
  return promptBase().replaceAll("{NOMBRE}", n);
}

const clamp = (v, lo, hi, d) => { const x = Math.round(Number(v)); return Number.isFinite(x) ? Math.min(hi, Math.max(lo, x)) : d; };
const enumVal = (k, v) => (ENUMS[k].includes(v) ? v : DEFAULTS[k]);

/** Aplica topes. state.intensidadPrevia (opcional) limita el cambio a ±1 por turno. */
function clampEstado(s = {}) {
  let intensidad = clamp(s.intensidad, 1, 7, 1);
  if (s.intensidadPrevia != null) {
    const p = clamp(s.intensidadPrevia, 1, 7, 1);
    intensidad = Math.min(p + 1, Math.max(p - 1, intensidad));
  }
  let juego = clamp(s.juego, 0, 3, 0);
  const afecto = clamp(s.afecto, 0, 2, 0);
  const limitado = s.plan === "basico" || s.build === "play" || s.playBuild === true;
  if (limitado) { intensidad = Math.min(intensidad, 4); juego = Math.min(juego, 2); }
  const vulnerable = s.vulnerable === true || s.regulacion === "activa";
  if (vulnerable) { intensidad = Math.min(intensidad, 2); juego = 0; }
  if (intensidad < 2) juego = 0;
  return { ...s, intensidad, juego, afecto, regulacion: vulnerable ? "activa" : enumVal("regulacion", s.regulacion) };
}

function buildEstadoLine(state = {}) {
  const s = clampEstado(state);
  const partes = [
    `etapa=${enumVal("etapa", s.etapa)}`,
    `dias=${clamp(s.dias, 0, 100000, 0)}`,
    `intensidad=${s.intensidad}:${NOMBRES_INTENSIDAD[s.intensidad]}`,
    `ritmo=${enumVal("ritmo", s.ritmo)}`,
    `energia_social=${enumVal("energia_social", s.energia_social)}`,
    `juego=${s.juego}`, `regulacion=${s.regulacion}`, `afecto=${s.afecto}`,
    `usuario_emocion=${enumVal("usuario_emocion", s.usuario_emocion)}`,
    `hora=${String(clamp(s.hora, 0, 23, new Date().getHours())).padStart(2, "0")}`,
    `momento=${enumVal("momento", s.momento)}`,
  ];
  if (s.pensamiento) partes.push(`pensamiento="${String(s.pensamiento).replace(/["\n\r]/g, " ").slice(0, 160).trim()}"`);
  partes.push(`propuesta=${enumVal("propuesta", s.propuesta)}`);
  return `[ESTADO] ${partes.reduce((a, b) => a + " · " + b)}`;
}

const REGLAS_FILTRO = [
  ["palabra_prohibida", /(^|[^\p{L}])(che|boludo|boluda|beb[eé]|mi amor)(?![\p{L}])/iu],
  ["declaracion_amor", /\b(te amo|te quiero tanto|estoy enamorad[ao]|me enamor[eé])\b/iu],
  ["mencion_sistema", /(^|[^\p{L}])(IA|inteligencia artificial|prompt|modelo de lenguaje|nivel(es)? de|eje [A-H]|ejes?)(?![\p{L}])/u],
];
function filtrarSalida(texto = "") {
  const reasons = REGLAS_FILTRO.filter(([, re]) => re.test(String(texto))).map(([r]) => r);
  return { ok: reasons.length === 0, reasons };
}
function personalidadActiva() { return /^(1|true|yes|si|sí)$/i.test(String(process.env.USE_PERSONALITY_PROMPT || "")); }

/** Antepone el prompt fijo y la línea de estado (si hay) a los mensajes. */
function aplicarPersonalidad(messages, { nombre, estado } = {}) {
  const sys = buildSystemPrompt({ nombre }) + (estado ? `\n\n${buildEstadoLine(estado)}` : "");
  return [{ role: "system", content: sys }, ...(messages || [])];
}

module.exports = { buildSystemPrompt, buildEstadoLine, clampEstado, filtrarSalida, personalidadActiva, aplicarPersonalidad, NOMBRES_INTENSIDAD };
