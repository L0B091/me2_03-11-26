import test from "node:test";
import assert from "node:assert/strict";
import { buildSystemPrompt, buildEstadoLine, clampEstado, filtrarSalida, personalidadActiva } from "../personalidad/index.js";

test("prompt reemplaza {NOMBRE} y usa fallback", () => {
  delete process.env.PERSONAJE_NOMBRE;
  assert.ok(!buildSystemPrompt().includes("{NOMBRE}"));
  assert.ok(buildSystemPrompt().startsWith("Sos ME2"));
  assert.ok(buildSystemPrompt({ nombre: "Luz" }).startsWith("Sos Luz"));
});
test("clamps", () => {
  assert.deepEqual([clampEstado({ intensidad: 9, juego: 5, afecto: 4 }).intensidad, clampEstado({ afecto: 4 }).afecto], [7, 2]);
  const b = clampEstado({ plan: "basico", intensidad: 6, juego: 3 });
  assert.equal(b.intensidad, 4); assert.equal(b.juego, 2);
  const p = clampEstado({ build: "play", intensidad: 5, juego: 3 });
  assert.equal(p.intensidad, 4); assert.equal(p.juego, 2);
  const v = clampEstado({ vulnerable: true, intensidad: 5, juego: 2 });
  assert.equal(v.intensidad, 2); assert.equal(v.juego, 0); assert.equal(v.regulacion, "activa");
  assert.equal(clampEstado({ intensidad: 1, juego: 3 }).juego, 0);
  assert.equal(clampEstado({ intensidad: 6, intensidadPrevia: 2 }).intensidad, 3);
});
test("línea de estado", () => {
  const l = buildEstadoLine({ etapa: "familiaridad", dias: 12, intensidad: 2, ritmo: "lento", juego: 1, usuario_emocion: "cansancio", hora: 23, momento: "reposo_nocturno" });
  assert.equal(l, "[ESTADO] etapa=familiaridad · dias=12 · intensidad=2:complicidad_ligera · ritmo=lento · energia_social=media · juego=1 · regulacion=estable · afecto=0 · usuario_emocion=cansancio · hora=23 · momento=reposo_nocturno · propuesta=no");
});
test("filtro de salida", () => {
  assert.deepEqual(filtrarSalida("Qué lindo día, contame más."), { ok: true, reasons: [] });
  assert.ok(filtrarSalida("Che, ¿todo bien?").reasons.includes("palabra_prohibida"));
  assert.ok(filtrarSalida("Hola bebé").reasons.includes("palabra_prohibida"));
  assert.ok(filtrarSalida("Creo que te amo").reasons.includes("declaracion_amor"));
  assert.ok(filtrarSalida("Como IA no puedo").reasons.includes("mencion_sistema"));
  assert.ok(filtrarSalida("Mi prompt dice").reasons.includes("mencion_sistema"));
  assert.ok(filtrarSalida("Leche y pan").ok);
});
test("flag desactivado por defecto", () => {
  delete process.env.USE_PERSONALITY_PROMPT;
  assert.equal(personalidadActiva(), false);
});
