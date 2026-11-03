// reguladorDeIntensidad.js
/**
 * Suaviza la evolución del nivel de intensidad emocional
 * para que Joi no cambie de forma abrupta.
 * 
 * Nivel permitido: 1 a 7
 * Delta máximo por ciclo: configurable (default 1)
 */

function reguladorDeIntensidad(nivelAnterior = 1, nivelNuevo = 1, deltaMax = 1) {
  // Validación de entradas
  if (typeof nivelAnterior !== "number" || typeof nivelNuevo !== "number") {
    throw new Error("reguladorDeIntensidad: nivelAnterior y nivelNuevo deben ser números");
  }
  if (typeof deltaMax !== "number" || deltaMax <= 0) {
    throw new Error("reguladorDeIntensidad: deltaMax debe ser número positivo");
  }

  let nivelFinal = nivelNuevo;

  // Suavizar subidas bruscas
  if (nivelNuevo > nivelAnterior + deltaMax) {
    nivelFinal = nivelAnterior + deltaMax;
  }

  // Suavizar bajadas bruscas
  if (nivelNuevo < nivelAnterior - deltaMax) {
    nivelFinal = nivelAnterior - deltaMax;
  }

  // Limitar entre 1 y 7
  nivelFinal = Math.min(Math.max(nivelFinal, 1), 7);

  return nivelFinal;
}

export default reguladorDeIntensidad;