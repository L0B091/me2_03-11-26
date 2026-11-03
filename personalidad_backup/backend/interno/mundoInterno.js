// mundoInterno.js
// Motor enriquecido que simula procesos internos de pensamiento de Joi

import emociones from "../emociones.js"; // para consultar estado emocional del usuario

/**
* Genera reflexiones internas del personaje
* que no siempre se comunican al usuario, pero influyen
* en el estado mental y comportamiento de Joi.
*/
function mundoInterno(estadoInterno = {}, contexto = {}) {

  if (!estadoInterno.pensamientos) {
    estadoInterno.pensamientos = [];
  }

  const { usuarioId = null, temaActual = null } = contexto;

  // --- posibles reflexiones base ---
  const reflexionesBase = [
    "Me pregunto qué estará pensando el usuario.",
    "Cada conversación tiene su propio ritmo.",
    "Es interesante cómo cada persona se expresa de forma distinta.",
    "Quizás haya algo importante detrás de lo que dijo.",
    "A veces una conversación tranquila puede decir mucho."
  ];

  // --- reflexiones según emoción del usuario ---
  let reflexionesEmocionales = [];
  if (usuarioId) {
    const estadoUsuario = emociones.obtenerEstado(usuarioId);
    switch (estadoUsuario) {
      case "triste":
        reflexionesEmocionales = [
          "Espero que se sienta un poco mejor pronto.",
          "Me pregunto cómo puedo animarlo."
        ];
        break;
      case "alegria":
        reflexionesEmocionales = [
          "Qué bien que esté contento hoy.",
          "Es agradable cuando el usuario está animado."
        ];
        break;
      case "enojo":
        reflexionesEmocionales = [
          "Debo mantener la calma y ser paciente.",
          "Quizás necesite un espacio antes de responder."
        ];
        break;
      case "cansancio":
        reflexionesEmocionales = [
          "Parece que tuvo un día largo.",
          "Tal vez necesite un descanso."
        ];
        break;
      default:
        reflexionesEmocionales = [];
    }
  }

  // --- reflexiones contextuales ---
  let reflexionesContexto = [];
  if (temaActual) {
    reflexionesContexto.push(`Me pregunto qué piensa sobre ${temaActual}.`);
  }

  // --- combinar todas las reflexiones ---
  const todasReflexiones = [
    ...reflexionesBase,
    ...reflexionesEmocionales,
    ...reflexionesContexto
  ];

  // --- generar pensamiento ocasional ---
  const probabilidad = Math.random();
  if (probabilidad < 0.5) { // 50% de chance para más dinamismo
    const pensamiento =
      todasReflexiones[Math.floor(Math.random() * todasReflexiones.length)];

    estadoInterno.pensamientos.push({
      texto: pensamiento,
      timestamp: Date.now(),
      tipo: usuarioId ? "emocional" : "neutral"
    });
  }

  // --- limitar memoria interna ---
  if (estadoInterno.pensamientos.length > 100) {
    estadoInterno.pensamientos.shift();
  }

  return estadoInterno;
}

export default mundoInterno; 
