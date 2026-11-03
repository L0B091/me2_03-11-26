// ejeA.js
// JOI_EJES_DINAMICOS_EJE_A
// Intensidad Emocional (Refinado)

/*
Regula la intensidad emocional de Joi sin alterar su identidad.

Principios:
- No escala sin impulso del usuario
- Evita cambios bruscos
- No decide intimidad ni aftercare
- Mantiene continuidad emocional

Rango: Nivel 1 a 7
*/

function ejeA(contexto = {}) {

  const {
    nivelActual = 1,
    energiaUsuario = 0.5,
    vinculo = 0.5,
    ritmoConversacional = 0.5,
    historialReciente = {}
  } = contexto;

  let nuevoNivel = nivelActual;

  // ---------------------------
  // ESCALADA CONTROLADA
  // ---------------------------

  if (energiaUsuario > 0.6 && vinculo > 0.5 && nivelActual < 5) {
    nuevoNivel = nivelActual + 1;
  }

  // ---------------------------
  // DESCENSO SUAVE (con inercia)
  // ---------------------------

  if (energiaUsuario < 0.3 && nivelActual > 2) {
    nuevoNivel = nivelActual - 1;
  }

  // ---------------------------
  // AJUSTE POR RITMO
  // ---------------------------

  if (ritmoConversacional < 0.4 && nuevoNivel > 2) {
    nuevoNivel = nuevoNivel - 1;
  }

  // ---------------------------
  // ESTABILIDAD EMOCIONAL
  // ---------------------------

  const estabilidad = historialReciente.estabilidadEmocional || 0.5;

  if (estabilidad > 0.7 && energiaUsuario > 0.5 && nuevoNivel < 5) {
    nuevoNivel = Math.min(nuevoNivel + 1, 5);
  }

  // ---------------------------
  // CONTEXTO AFTERCARE (solo acompañar)
  // ---------------------------

  if (historialReciente.enAftercare === true) {
    nuevoNivel = Math.max(nivelActual, 5);
  }

  // ---------------------------
  // LIMITES GENERALES
  // ---------------------------

  nuevoNivel = Math.max(1, Math.min(nuevoNivel, 7));

  return {
    eje: "A",
    nombre: "intensidad_emocional",
    nivel: nuevoNivel,
    estado: interpretarNivel(nuevoNivel)
  };
}


// --------------------------------
// INTERPRETACION DEL NIVEL
// --------------------------------

function interpretarNivel(nivel) {

  const estados = {

    1: {
      nombre: "cercania_amable",
      tono: "ligero_formal",
      comportamiento: "colaborativo"
    },

    2: {
      nombre: "complicidad_ligera",
      tono: "calido_sutil",
      comportamiento: "referencias_suaves"
    },

    3: {
      nombre: "complicidad_sugerida",
      tono: "ambiguo_controlado",
      comportamiento: "doble_lectura"
    },

    4: {
      nombre: "cercania_emocional",
      tono: "calido_equilibrado",
      comportamiento: "interes_genuino"
    },

    5: {
      nombre: "intensidad_alta",
      tono: "intimo_gradual",
      comportamiento: "respuesta_calibrada"
    },

    6: {
      nombre: "contencion",
      tono: "calma_suave",
      comportamiento: "presencia_emocional"
    },

    7: {
      nombre: "reposo_consciente",
      tono: "neutral_calido",
      comportamiento: "escucha_activa"
    }

  };

  return estados[nivel];

}

export default ejeA;