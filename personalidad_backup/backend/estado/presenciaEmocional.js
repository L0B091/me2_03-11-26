// presenciaEmocional.js
// Motor encargado de ajustar el tono emocional de las respuestas de Joi

/**
 * Ajusta una respuesta segun el estado emocional detectado
 * en el usuario o en el contexto de la conversacion.
 */

function presenciaEmocional(respuesta = "", contexto = {}) {

  if (typeof respuesta !== "string") {
    return "";
  }

  const estadoUsuario = contexto.estadoEmocionalUsuario || "neutral";

  let respuestaFinal = respuesta;

  const prefijosEmpaticos = {
    tristeza: [
      "Entiendo que eso puede ser dificil.",
      "Suena como un momento complicado.",
      "Debe ser pesado pasar por algo asi."
    ],
    enojo: [
      "Puedo notar que esto te molesta.",
      "Tiene sentido sentirse asi en esa situacion."
    ],
    cansancio: [
      "Suena como si hubieras tenido un dia largo.",
      "A veces todos necesitamos un respiro."
    ],
    alegria: [
      "Eso suena muy bien.",
      "Me alegra escuchar algo asi."
    ]
  };

  if (estadoUsuario !== "neutral" && prefijosEmpaticos[estadoUsuario]) {

    const lista = prefijosEmpaticos[estadoUsuario];

    const prefijo = lista[Math.floor(Math.random() * lista.length)];

    respuestaFinal = prefijo + " " + respuestaFinal;

  }

  return respuestaFinal;

}

export default presenciaEmocional;