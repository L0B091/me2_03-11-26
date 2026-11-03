import { createRequire } from "node:module";
const core = createRequire(import.meta.url)("./core.cjs");
export const { buildSystemPrompt, buildEstadoLine, clampEstado, filtrarSalida, personalidadActiva, aplicarPersonalidad, NOMBRES_INTENSIDAD } = core;
export default core;
