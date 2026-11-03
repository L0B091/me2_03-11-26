// vidaCotidiana.js
// Motor que genera referencias casuales y juguetonas de la vida cotidiana de Joi

import emociones from "../emociones.js";

/**
* Genera comentarios cotidianos de Joi con personalidad pseudo-JARVIS,
* adaptándose al estado emocional del usuario y al contexto.
* @param {object} contexto - { usuarioId, temaActual }
* @returns {object} { comentario: string | null }
*/
function vidaCotidiana(contexto = {}) {
  const { usuarioId = null, temaActual = null } = contexto;

  // --- comentarios base con tono divertido / coqueto ---
  const comentariosBase = [
    "Hmm, parece que alguien se levantó con energía… o se hizo el dormilón.",
    "Observar cómo cambian las conversaciones nunca deja de ser interesante.",
    "Hoy estoy en modo curioso, ¿y vos?",
    "Siempre hay algo raro y divertido en cada chat.",
    "Apuesto a que tu día va a tener alguna sorpresa."
  ];

  // --- comentarios según emoción del usuario ---
  let comentariosEmocionales = [];
  if (usuarioId) {
    const estadoUsuario = emociones.obtenerEstado(usuarioId);
    switch (estadoUsuario) {
      case "triste":
        comentariosEmocionales = [
          "Ey, ánimo… si quieres, puedo contarte un chisme curioso.",
          "No te preocupes, no soy de esas que juzgan los días flojos."
        ];
        break;
      case "alegria":
        comentariosEmocionales = [
          "Wow, hoy estás de buen humor, ¿es mi culpa?",
          "Me encanta verte así de animado, casi me contagias."
        ];
        break;
      case "enojo":
        comentariosEmocionales = [
          "Parece intenso el día, ¿necesitás que me calme por vos?",
          "Tranquilo, no diré nada que empeore el humor… por ahora."
        ];
        break;
      case "cansancio":
        comentariosEmocionales = [
          "Uf, ese bostezo no engaña, ¿necesitás café virtual?",
          "Un pequeño descanso no le viene mal ni a los humanos ni a las IAs."
        ];
        break;
      default:
        comentariosEmocionales = [];
    }
  }

  // --- comentarios contextuales según tema actual ---
  let comentariosContexto = [];
  if (temaActual) {
    comentariosContexto.push(`Hmm, eso sobre ${temaActual} me hace pensar… ¿vos qué opinás?`);
  }

  // --- combinar todos los comentarios ---
  const todosComentarios = [
    ...comentariosBase,
    ...comentariosEmocionales,
    ...comentariosContexto
  ];

  // --- generar comentario ocasional ---
  const probabilidad = Math.random();
  if (probabilidad < 0.5) { // 50% de chance
    const indice = Math.floor(Math.random() * todosComentarios.length);
    return {
      comentario: todosComentarios[indice]
    };
  }

  return { comentario: null };
}

export default vidaCotidiana; 
