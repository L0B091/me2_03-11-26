// ritmoConversacional.js
// Motor encargado de regular el ritmo y tempo de la conversación de Joi
// Versión optimizada: delays aleatorios, jerarquía de reglas y coherencia con ejes B/C

/**
 * Determina cómo debe responder Joi según
 * la dinámica actual del diálogo.
 */

function ritmoConversacional(contexto = {}) {
  const {
    longitudMensajeUsuario = 0,
    energiaUsuario = "media",
    tiempoSilencio = 0,
    estadoEjeB = "medio", // ritmo conversacional actual según ejeB
    estadoEjeC = "media"  // energía social según ejeC
  } = contexto;

  let ritmo = {
    tipoRespuesta: "normal",
    delayRespuesta: 0
  };

  // --------------------------------
  // Regla 1: silencio prolongado
  // --------------------------------
  if (tiempoSilencio > 30) {
    ritmo.tipoRespuesta = "reactivacion";
    ritmo.delayRespuesta = 500 + Math.floor(Math.random() * 500); // 500-1000ms
    return ritmo;
  }

  // --------------------------------
  // Regla 2: usuario con energía baja
  // --------------------------------
  if (energiaUsuario === "baja" || estadoEjeC === "baja") {
    ritmo.tipoRespuesta = "suave";
    ritmo.delayRespuesta = 800 + Math.floor(Math.random() * 400); // 800-1200ms
    return ritmo;
  }

  // --------------------------------
  // Regla 3: mensajes muy cortos
  // --------------------------------
  if (longitudMensajeUsuario < 20) {
    ritmo.tipoRespuesta = "breve";
    ritmo.delayRespuesta = 300 + Math.floor(Math.random() * 300); // 300-600ms
    return ritmo;
  }

  // --------------------------------
  // Regla 4: mensajes largos
  // --------------------------------
  if (longitudMensajeUsuario > 120) {
    ritmo.tipoRespuesta = "reflexiva";
    ritmo.delayRespuesta = 1000 + Math.floor(Math.random() * 800); // 1000-1800ms
    return ritmo;
  }

  // --------------------------------
  // Regla 5: ajustar según ejeB (ritmo conversacional)
  // --------------------------------
  switch (estadoEjeB) {
    case "lento":
      ritmo.tipoRespuesta = "lento";
      ritmo.delayRespuesta = 900 + Math.floor(Math.random() * 600); // 900-1500ms
      break;
    case "alto":
      ritmo.tipoRespuesta = "rapido";
      ritmo.delayRespuesta = 200 + Math.floor(Math.random() * 400); // 200-600ms
      break;
    default:
      ritmo.tipoRespuesta = "normal";
      ritmo.delayRespuesta = 400 + Math.floor(Math.random() * 400); // 400-800ms
  }

  return ritmo;
}

export default ritmoConversacional;