// detectorDeIntensidad.js
/**
 * Detecta el nivel de intensidad emocional del usuario y devuelve un contexto
 * para que el eje A y el bucle interactivo ajusten la interacción.
 */

function detectorDeIntensidad(contexto = {}) {

  const {
    mensajeUsuario = "",
    historial = {},
    ultimaEnergia = 0.5,
    ultimoVinculo = 0.5
  } = contexto;

  let energiaUsuario = ultimaEnergia;
  let vinculo = ultimoVinculo;

  const texto = mensajeUsuario.toLowerCase();

  // --------------------------------
  // DETECCIÓN DE ENERGÍA
  // --------------------------------
  if (texto.includes("quiero") || texto.includes("vamos") || texto.includes("ya")) {
    energiaUsuario = Math.min(energiaUsuario + 0.2, 1);
  }

  if (texto.includes("parar") || texto.includes("ya no") || texto.includes("terminé")) {
    energiaUsuario = Math.max(energiaUsuario - 0.3, 0);
  }

  // --------------------------------
  // DETECCIÓN DE VÍNCULO / CONFIANZA
  // --------------------------------
  if (historial.cercaniaReciente) vinculo = Math.min(vinculo + 0.1, 1);
  if (historial.confianzaBaja) vinculo = Math.max(vinculo - 0.2, 0);

  // --------------------------------
  // FLAG DE CONSENTIMIENTO A INTIMIDAD
  // --------------------------------
  const consentimientoIntimidad = /sí|ok|dale|quiero|vamos/i.test(texto);

  return {
    energiaUsuario,
    vinculo,
    consentimientoIntimidad
  };
}

export default detectorDeIntensidad;