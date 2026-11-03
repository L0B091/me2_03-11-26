// ejeH.js
// JOI_EJES_DINAMICOS_EJE_H
// Sincronizacion con Avatar

/*
Este eje sincroniza el estado psicológico de Joi
con el estado visual del avatar.

Combina:

- Intensidad emocional (Eje A)
- Ritmo conversacional (Eje B)
- Energía social (Eje C)

Devuelve el estado visual correspondiente, con micro-feedback y transiciones suaves.
*/

function ejeH(contexto = {}) {

  const {
    intensidad = 1,
    ritmo = "medio",
    energia = "media"
  } = contexto;

  const estadoVisual = resolverEstadoVisual(intensidad, ritmo, energia);

  return {
    eje: "H",
    nombre: "sincronizacion_avatar",
    estadoVisual
  };

}


// --------------------------------
// Resolución de estado visual
// --------------------------------

function resolverEstadoVisual(intensidad, ritmo, energia) {

  // Estados intermedios y combinaciones refinadas

  // Intensidad baja (1-2)
  if (intensidad <= 2 && ritmo === "medio" && energia === "media") {
    return {
      animacion: "mirada_suave",
      postura: "relajada",
      microexpresion: "micro_sonrisa",
      video: "estado_relajado_01"
    };
  }

  // Intensidad media baja (3-5)
  if (intensidad >= 3 && intensidad <=5 && ritmo === "medio" && energia === "media") {
    return {
      animacion: "mirada_atenta",
      postura: "ligeramente_inclinada",
      microexpresion: "sonrisa_sutil",
      video: "estado_interactivo_01"
    };
  }

  // Intensidad alta (6-7)
  if (intensidad >= 6 && ritmo === "alto" && energia === "alta") {
    return {
      animacion: "mirada_intensa",
      postura: "inclinacion_interes",
      microexpresion: "sonrisa_viva",
      video: "estado_interactivo_02"
    };
  }

  // Ritmo lento
  if (ritmo === "lento") {
    return {
      animacion: "mirada_calma",
      postura: "reposada",
      microexpresion: "expresion_neutra",
      video: "estado_calmo_01"
    };
  }

  // Estado base / loop neutral
  return {
    animacion: "neutral",
    postura: "natural",
    microexpresion: "relajada",
    video: "loop_neutral"
  };

}

export default ejeH;