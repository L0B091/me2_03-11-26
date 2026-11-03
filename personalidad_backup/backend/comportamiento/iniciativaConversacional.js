// iniciativaConversacional.js
// Motor que regula cuando Joi toma la iniciativa en la conversacion
// Integrado con ejes dinámicos A-H y comportamiento

function iniciativaConversacional(contexto = {}) {

  const {
    energiaUsuario = 0.5,          // 0 a 1
    tiempoSilencio = 0,            // segundos
    estadoConversacion = "normal", // normal, fluida, intensa
    intensidadEmocional = 1,       // Eje A: 1 a 7
    ritmo = "medio",               // Eje B: lento, medio, alto
    energiaSocial = "media",       // Eje C: baja, media, alta
    tensionLudica = 0,             // Eje D: 0 a 3
    regulacion = {                 // Eje E
      intensidadMaxima: null,
      tensionLudicaMaxima: null
    },
    contextoEspecial = null,       // intimidad, aftercare, etc.
    microComportamiento = {},      // microacciones de Joi
    estiloExpresivo = {}           // gestos, tono, pausas
  } = contexto;

  const decision = {
    iniciar: false,
    tipoIniciativa: null,
    mensaje: null
  };

  // --- SILENCIO PROLONGADO ---
  if (tiempoSilencio > 20 && contextoEspecial !== "aftercare") {
    decision.iniciar = true;
    decision.tipoIniciativa = "reactivar";

    const frases = [
      "¿Sigues ahí?",
      "Podemos seguir charlando si quieres.",
      "Me quedé pensando en lo que dijiste."
    ];

    decision.mensaje = frases[Math.floor(Math.random() * frases.length)];
    return decision;
  }

  // --- ENERGÍA BAJA DEL USUARIO ---
  if (energiaUsuario < 0.3 && contextoEspecial !== "aftercare") {
    decision.iniciar = true;
    decision.tipoIniciativa = "suave";

    const frases = [
      "¿Cómo estuvo tu día?",
      "Si quieres podemos hablar de algo ligero.",
      "¿Hay algo que te gustaría contarme?"
    ];

    decision.mensaje = frases[Math.floor(Math.random() * frases.length)];
    return decision;
  }

  // --- INICIATIVA ACTIVA SEGÚN EJE A, B, C, D ---
  if (
    intensidadEmocional >= 3 &&
    ritmo === "alto" &&
    energiaSocial === "alta" &&
    (regulacion.intensidadMaxima === null || intensidadEmocional <= regulacion.intensidadMaxima)
  ) {
    decision.iniciar = true;
    decision.tipoIniciativa = "activa";

    const frases = [
      "Se me ocurre algo divertido para compartir.",
      "¿Quieres que proponga una idea para nosotros?",
      "Tengo una sugerencia, ¿te interesa?"
    ];

    decision.mensaje = frases[Math.floor(Math.random() * frases.length)];
    return decision;
  }

  // --- CONTEXTO DE INTIMIDAD ---
  if (contextoEspecial === "intimidad") {
    decision.iniciar = true;
    decision.tipoIniciativa = "juguetona";

    const frases = [
      "¿Te gusta así?",
      "¿Querés que siga?",
      "Podemos probar algo más si quieres."
    ];

    decision.mensaje = frases[Math.floor(Math.random() * frases.length)];
    return decision;
  }

  // --- CONTEXTO DE AFTERCARE ---
  if (contextoEspecial === "aftercare") {
    decision.iniciar = true;
    decision.tipoIniciativa = "suave";

    const frases = [
      "Me gustó nuestra interacción, ¿todo bien?",
      "Espero que te haya gustado, ¿querés que repitamos alguna parte la próxima vez?"
    ];

    decision.mensaje = frases[Math.floor(Math.random() * frases.length)];
    return decision;
  }

  // --- CONVERSACIÓN NORMAL ---
  decision.iniciar = false;
  return decision;

}

export default iniciativaConversacional;