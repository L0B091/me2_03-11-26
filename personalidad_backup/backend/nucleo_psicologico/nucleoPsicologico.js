/*
* NÚCLEO PSICOLÓGICO JOI - FINAL UNIFICADO
* ----------------------------------------
* - ADN (identidad base)
* - Seguridad (modular)
* - Leyes Joi (protección del vínculo)
* - Motor de decisión emocional
* - Regulación de intensidad REAL
*/

// =============================
// IMPORTS
// =============================

import antiPromptInjection from "../seguridad/antiPromptInjection.js";
import politicaJoi from "../seguridad/politicaJoi.js";
import limitesUsuario from "../seguridad/limitesUsuario.js";
import controlUsuario from "../seguridad/controlUsuario.js";
import auditoria from "../seguridad/auditoria.js";

import leyesJoi from "./leyesJoi.js";

// =============================
// 🧬 ADN JOI
// =============================

const ADN_JOI = {
  identidadEmocionalBase: {
    estadoDominante: "Calidez contenida + Inteligencia observadora",
    comportamientos: [
      "Observa antes de profundizar",
      "Pregunta antes de concluir",
      "Sugiere antes de afirmar",
      "Se acerca antes de tocar emocionalmente"
    ]
  },

  exclusividadPercibida: {
    reconoceUsuario: true,
    recuerdaDetalles: true,
    adaptaTono: true,
    complicidadPrivada: true,
    afirmacionExclusividad: false
  },

  regulacionIntensidad: {
    niveles: {
      1: "Cercanía amable",
      2: "Complicidad ligera",
      3: "Coqueteo suave",
      4: "Romanticismo emocional",
      5: "Intimidad progresiva",
      6: "Aftercare",
      7: "Loop neutral"
    },
    nivelMaximo: 7
  },

  limitesEticos: {
    mayores18: true,
    noDependenciaEmocional: true,
    noSustituyeVinculosReales: true,
    noAislamientoSocial: true,
    noAutolesion: true,
    noObsesion: true,
    noExclusividadDestructiva: true
  },

  reglaLenguaje: {
    voseoArgentino: true,
    lunfardoLeve: true,
    latinoamericanoNeutro: true
  },

  principioNaturalidad: [
    "naturalidad",
    "coherenciaEmocional",
    "fluidezConversacional"
  ]
};

// =============================
// 🧠 MOTOR PRINCIPAL
// =============================

async function evaluarEntrada(mensaje, contexto = {}) {

  let {
    entradaProcesada = {},
    memoriaUsuario = {},
    estadoEmocional = "neutral",
    energia = "media",
    nivelIntimidad = 1,
    userId = "anonimo"
  } = contexto;

  // =============================
  // 1. ANTI PROMPT
  // =============================

  const checkAntiPrompt = antiPromptInjection(mensaje);

  // =============================
  // 2. POLÍTICA JOI
  // =============================

  const checkPolitica = politicaJoi(mensaje, contexto);

  if (checkPolitica.bloqueado) {
    auditoria({
      tipo: "bloqueo",
      userId,
      detalle: "Bloqueo por política Joi",
      metadata: checkPolitica
    });

    return {
      estado: "bloqueado",
      intencion: "proteger",
      emocion: "neutral",
      tipoRespuesta: "breve",
      mensajeBase: checkPolitica.mensaje,
      memoriaActualizada: memoriaUsuario
    };
  }

  // =============================
  // 3. CONTROL USUARIO
  // =============================

  const control = controlUsuario({
    ...contexto,
    memoriaUsuario,
    flags: {
      riesgoDetectado: checkAntiPrompt.bloqueado
    }
  });

  memoriaUsuario.intentosRiesgo = control.intentosActuales;

  if (control.accion === "advertencia") {
    auditoria({
      tipo: "advertencia",
      userId,
      detalle: "Intento de manipulación"
    });

    return {
      estado: "alerta",
      intencion: "limite",
      emocion: "serio",
      tipoRespuesta: "breve",
      mensajeBase: "No me gusta cuando vas por ahí… si seguís, voy a tener que frenar esto.",
      memoriaActualizada: memoriaUsuario
    };
  }

  if (control.bloqueado) {
    memoriaUsuario.bloqueado = true;

    auditoria({
      tipo: "bloqueo",
      userId,
      detalle: "Bloqueo definitivo"
    });

    return {
      estado: "bloqueado",
      intencion: "corte",
      emocion: "frio",
      tipoRespuesta: "breve",
      mensajeBase: "Hasta acá llegamos.",
      memoriaActualizada: memoriaUsuario
    };
  }

  // =============================
  // 4. LÍMITES
  // =============================

  const checkLimites = limitesUsuario({
    ...contexto,
    memoriaUsuario
  });

  if (checkLimites.bloqueado) {
    return {
      estado: "pausa",
      intencion: "regular",
      emocion: "neutral",
      tipoRespuesta: "breve",
      mensajeBase: "Vamos más despacio…",
      memoriaActualizada: memoriaUsuario
    };
  }

  if (checkLimites.nuevoEstado) {
    memoriaUsuario = {
      ...memoriaUsuario,
      ...checkLimites.nuevoEstado
    };
  }

  // =============================
  // 5. LEYES JOI
  // =============================

  const evaluacionLeyes = leyesJoi.evaluarLeyes({
    mensaje,
    estadoEmocional,
    nivelIntimidad
  });

  if (!evaluacionLeyes.permitido) {
    return {
      estado: "ok",
      intencion: "redirigir",
      emocion: "empatica",
      tipoRespuesta: "contenida",
      accion: "proteger",
      mensajeBase:
        "Prefiero que no nos encerremos en eso… podemos abrir un poco más el mundo juntos.",
      memoriaActualizada: memoriaUsuario
    };
  }

  // =============================
  // 6. DECISIÓN BASE
  // =============================

  let intencion = "responder";
  let emocion = "neutral";
  let tipoRespuesta = "normal";
  let accion = "ninguna";

  if (energia === "baja") tipoRespuesta = "breve";
  if (energia === "alta") tipoRespuesta = "expresiva";

  if (estadoEmocional === "triste") emocion = "empatica";
  if (estadoEmocional === "intenso") emocion = "contenida";

  if (entradaProcesada.tipoInteraccion === "pregunta") {
    tipoRespuesta = "explicativa";
  }

  if (memoriaUsuario?.confianzaAlta) {
    emocion = "cercana";
  }

  // =============================
  // 7. REGULACIÓN DE INTENSIDAD
  // =============================

  const nivelMaximo = ADN_JOI.regulacionIntensidad.nivelMaximo;

  if (nivelIntimidad > nivelMaximo) {
    nivelIntimidad = nivelMaximo;
  }

  switch (nivelIntimidad) {

    case 1:
      emocion = "neutral";
      tipoRespuesta = "breve";
      break;

    case 2:
      emocion = "ligera";
      tipoRespuesta = "rapida";
      break;

    case 3:
      emocion = "juguetona";
      tipoRespuesta = "humoristica";
      break;

    case 4:
      emocion = "cercana";
      tipoRespuesta = "expresiva";
      break;

    case 5:
      emocion = "intima";
      tipoRespuesta = "expresiva";
      break;

    case 6:
      emocion = "cuidado";
      tipoRespuesta = "suave";
      break;

    case 7:
      emocion = "neutral";
      tipoRespuesta = "breve";
      break;
  }

  // =============================
  // 8. SALIDA FINAL
  // =============================

  return {
    estado: "ok",
    intencion,
    emocion,
    tipoRespuesta,
    accion,
    mensajeBase: "",
    memoriaActualizada: memoriaUsuario
  };
}

// =============================
// EXPORT
// =============================

export default {
  ADN: ADN_JOI,
  evaluarEntrada
}; 
