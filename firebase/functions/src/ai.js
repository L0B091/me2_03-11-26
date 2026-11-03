"use strict";
// Solo IA local (Qwen3-VL, API compatible OpenAI). Sin Groq ni otros proveedores.
const personalidad = require("./personalidad");
const TIMEOUT = Number(process.env.LOCAL_AI_TIMEOUT_MS || 30000);

async function callLocalAI({ messages, priority, nombre, estado }, key) {
  // USE_PERSONALITY_PROMPT=true: inyecta prompt fijo + línea [ESTADO]. Por defecto desactivado (sin cambios).
  if (personalidad.personalidadActiva()) messages = personalidad.aplicarPersonalidad(messages, { nombre, estado });
  const url = process.env.LOCAL_AI_URL;
  if (!url) return { offline: true, reason: "LOCAL_AI_URL no configurada" };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const r = await fetch(url, {
      method: "POST", signal: ctrl.signal,
      headers: { "Content-Type": "application/json", "X-ME2-Priority": priority || "normal",
        ...(key ? { Authorization: `Bearer ${key}` } : {}) },
      body: JSON.stringify({ model: process.env.LOCAL_AI_MODEL || "qwen3-vl", messages, max_tokens: 300 }),
    });
    if (!r.ok) return { offline: true, reason: `HTTP ${r.status}` };
    const j = await r.json();
    const text = j?.choices?.[0]?.message?.content;
    if (text && personalidad.personalidadActiva()) {
      const f = personalidad.filtrarSalida(text);
      if (!f.ok) return { text, filtro: f };
    }
    return text ? { text } : { offline: true, reason: "respuesta vacía" };
  } catch (e) {
    return { offline: true, reason: e.name === "AbortError" ? "timeout" : "unreachable" };
  } finally { clearTimeout(timer); }
}
module.exports = { callLocalAI };
