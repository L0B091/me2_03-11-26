// memoriaAfectiva.js
// Motor encargado de registrar y recuperar señales emocionales del usuario

/**
 * Este motor analiza el mensaje del usuario y detecta
 * posibles señales emocionales. Luego puede registrar
 * esa información en la memoria del sistema.
 */

function memoriaAfectiva(mensajeUsuario = "", memoriaUsuario = {}) {

  if (typeof mensajeUsuario !== "string") {
    return memoriaUsuario;
  }

  const mensaje = mensajeUsuario.toLowerCase();

  let estadoDetectado = null;

  // --- deteccion simple de emociones ---
  const patrones = {
    alegria: ["feliz", "contento", "genial", "alegre"],
    tristeza: ["triste", "mal", "deprimido", "solo"],
    enojo: ["enojado", "molesto", "fastidiado"],
    cansancio: ["cansado", "agotado", "sin energia"]
  };

  for (const emocion in patrones) {

    const lista = patrones[emocion];

    for (const palabra of lista) {

      if (mensaje.includes(palabra)) {
        estadoDetectado = emocion;
        break;
      }

    }

    if (estadoDetectado) {
      break;
    }

  }

  // --- registrar emocion detectada ---
  if (estadoDetectado) {

    memoriaUsuario.estadoEmocionalActual = estadoDetectado;

    if (!memoriaUsuario.historialEmocional) {
      memoriaUsuario.historialEmocional = [];
    }

    memoriaUsuario.historialEmocional.push({
      emocion: estadoDetectado,
      timestamp: Date.now()
    });

  }

  return memoriaUsuario;

}

export default memoriaAfectiva;