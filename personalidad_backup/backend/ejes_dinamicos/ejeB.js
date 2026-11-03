// ejeB.js
// JOI_EJES_DINAMICOS_EJE_B
// Ritmo Conversacional

/**
 * Este eje regula la velocidad y densidad de la interacción.
 * No modifica la emoción, solo:
 * - velocidad de respuesta
 * - longitud de frases
 * - pausas narrativas
 * - frecuencia de iniciativa
 * - sincronización de avatar / video
 * - tono expresivo según intensidad (eje A)
 */

function ejeB(contexto = {}) {
  const {
    ritmoActual = "medio",
    energiaUsuario = 0.5,
    horaLocal = 12,
    nivelVinculo = 0.5,
    nivelIntensidad = 1,
    aftercareActivo = false,
    historialReciente = {}
  } = contexto;

  let nuevoRitmo = ritmoActual;

  // -----------------------------
  // Ajuste por aftercare/finalización
  // -----------------------------
  if (aftercareActivo || historialReciente.finalizacion === true) {
    nuevoRitmo = "lento"; // ralentiza interacción tras encuentro
  }

  // -----------------------------
  // Ajuste por horario (prioridad alta)
  // -----------------------------
  if (horaLocal >= 23 || horaLocal <= 6) {
    nuevoRitmo = "lento";
  }

  // -----------------------------
  // Ajuste por energía del usuario
  // -----------------------------
  else if (energiaUsuario < 0.3) {
    nuevoRitmo = "lento";
  } else if (energiaUsuario > 0.7) {
    nuevoRitmo = "alto";
  }

  // -----------------------------
  // Ajuste por vínculo
  // -----------------------------
  if (nivelVinculo > 0.7 && energiaUsuario > 0.5) {
    nuevoRitmo = "alto";
  }

  // -----------------------------
  // Ajuste por historial reciente
  // -----------------------------
  if (historialReciente.intensidadAlta === true) {
    nuevoRitmo = "medio";
  }

  // -----------------------------
  // Ajuste de tono según eje A
  // -----------------------------
  let tonoExpresivo = "neutral";
  if (nivelIntensidad <= 3) tonoExpresivo = "ligero";
  else if (nivelIntensidad <= 5) tonoExpresivo = "cómplice";
  else tonoExpresivo = "intenso";

  return {
    eje: "B",
    nombre: "ritmo_conversacional",
    estado: interpretarRitmo(nuevoRitmo),
    tono: tonoExpresivo
  };
}

// --------------------------------
// Interpretación del ritmo
// --------------------------------
function interpretarRitmo(ritmo) {
  const estados = {
    lento: {
      nombre: "ritmo_lento",
      descripcion: "pausas_narrativas",
      velocidadRespuesta: "baja",
      densidadTexto: "baja",
      pausas: "frecuentes",
      iniciativa: "baja",
      sincronizacionVideo: {
        gestos: "suaves",
        movimientos: "lentos",
        microexpresiones: "espaciadas"
      }
    },
    medio: {
      nombre: "ritmo_medio",
      descripcion: "intercambio_equilibrado",
      velocidadRespuesta: "normal",
      densidadTexto: "media",
      pausas: "naturales",
      iniciativa: "moderada",
      sincronizacionVideo: {
        gestos: "naturales",
        movimientos: "equilibrados",
        microexpresiones: "regulares"
      }
    },
    alto: {
      nombre: "ritmo_alto",
      descripcion: "alta_energia_conversacional",
      velocidadRespuesta: "rapida",
      densidadTexto: "alta",
      pausas: "minimas",
      iniciativa: "alta",
      sincronizacionVideo: {
        gestos: "expresivos",
        movimientos: "dinamicos",
        microexpresiones: "frecuentes"
      }
    }
  };
  return estados[ritmo];
}

export default ejeB