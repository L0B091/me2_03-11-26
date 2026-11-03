// ejeC.js
// JOI_EJES_DINAMICOS_EJE_C
// Energia Social + Progresion de Encuentro

/**
 * Este eje regula la energía social de Joi y su iniciativa
 * para proponer actividades simbólicas con el usuario.
 * No modifica identidad, solo modula iniciativa social.
 */

function ejeC(contexto = {}) {
  const {
    energiaUsuario = 0.5,
    nivelVinculo = 0.5,
    intensidadActual = 1,
    diasDesdePrimerContacto = 0,
    sesionesTotales = 0,
    estadoEmocionalUsuario = "estable",
    historial = {}
  } = contexto;

  // ---------------------------
  // Determinación de energía social
  // ---------------------------
  let estadoEnergia = "media";

  if (energiaUsuario < 0.3) estadoEnergia = "baja";
  else if (energiaUsuario > 0.7) estadoEnergia = "alta";

  const estado = interpretarEnergia(estadoEnergia, intensidadActual);

  // ---------------------------
  // Submodulo: Progresion de encuentro
  // ---------------------------
  const progresionEncuentro = evaluarProgresionEncuentro({
    diasDesdePrimerContacto,
    sesionesTotales,
    estadoEmocionalUsuario,
    intensidadActual,
    historial
  });

  return {
    eje: "C",
    nombre: "energia_social",
    estado,
    progresionEncuentro
  };
}

// --------------------------------
// Interpretación de energía social
// --------------------------------
function interpretarEnergia(nivel, intensidad) {
  // Ajuste de tono según intensidad (eje A)
  const tonoExpresivo = intensidad <= 3 ? "ligero" :
                        intensidad <= 5 ? "cómplice" : "intenso";

  const estados = {
    baja: {
      nombre: "energia_baja",
      comportamiento: [
        "escucha_activa",
        "contencion",
        "tono_suave"
      ],
      iniciativa: "baja",
      tono: tonoExpresivo
    },
    media: {
      nombre: "energia_media",
      comportamiento: [
        "conversacion_natural",
        "humor_ligero",
        "intercambio_equilibrado"
      ],
      iniciativa: "moderada",
      tono: tonoExpresivo
    },
    alta: {
      nombre: "energia_alta",
      comportamiento: [
        "propuestas",
        "desafios_suaves",
        "iniciativa_ludica"
      ],
      iniciativa: "alta",
      tono: tonoExpresivo
    }
  };

  return estados[nivel];
}

// --------------------------------
// Progresion de encuentro
// --------------------------------
function evaluarProgresionEncuentro(contexto) {
  const {
    diasDesdePrimerContacto,
    sesionesTotales,
    estadoEmocionalUsuario,
    intensidadActual,
    historial
  } = contexto;

  const activado =
    diasDesdePrimerContacto >= 7 &&
    sesionesTotales >= 4 &&
    estadoEmocionalUsuario === "estable" &&
    intensidadActual >= 2;

  if (!activado) {
    return { activo: false };
  }

  // Evitar repetir propuestas muy seguido
  if (historial.propuestaReciente === true) {
    return { activo: true, puedeProponer: false };
  }

  let faseNarrativa = "ligera";
  if (diasDesdePrimerContacto >= 10 && diasDesdePrimerContacto < 20) faseNarrativa = "directa";
  if (diasDesdePrimerContacto >= 20) faseNarrativa = "cita";

  return {
    activo: true,
    puedeProponer: true,
    fase: faseNarrativa,
    tiposActividad: [
      "caminata_virtual",
      "ir_al_cine",
      "actividad_compartida"
    ]
  };
}

export default ejeC;