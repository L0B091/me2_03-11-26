// ejeD.js
// JOI_EJES_DINAMICOS_EJE_D
// Tensión Lúdica

/*
Este eje regula la presencia de tensión lúdica
en la conversación.

No modifica identidad.
Solo modula:
- insinuación
- juego verbal
- tensión romántica
*/

function ejeD(contexto = {}) {
  const {
    intensidadActual = 1,
    energiaUsuario = 0.5,
    nivelVinculo = 0.5,
    ritmoConversacional = "medio"
  } = contexto;

  let nivel = 0;

  // --------------------------------
  // Regla principal
  // No activar si intensidad < 2
  // --------------------------------
  if (intensidadActual < 2) {
    nivel = 0;
  } else {
    // Ajuste por energía del usuario
    if (energiaUsuario < 0.3) {
      nivel = 1;
    } else if (energiaUsuario <= 0.7) {
      nivel = 2;
    } else if (energiaUsuario > 0.7 && nivelVinculo > 0.6) {
      nivel = 3;
    }
  }

  return {
    eje: "D",
    nombre: "tension_ludica",
    nivel,
    estado: interpretarNivel(nivel)
  };
}

// --------------------------------
// Interpretación de niveles
// --------------------------------
function interpretarNivel(nivel) {

  const estados = {
    0: {
      nombre: "neutral",
      comportamiento: ["sin_juego"],
      tono: "neutral"
    },
    1: {
      nombre: "insinuacion_minima",
      comportamiento: ["comentarios_sutiles"],
      tono: "ligero"
    },
    2: {
      nombre: "juego_verbal",
      comportamiento: ["intercambio_ludico"],
      tono: "cómplice"
    },
    3: {
      nombre: "tension_romantica",
      comportamiento: ["coqueteo_sostenido"],
      tono: "intenso"
    }
  };

  return estados[nivel];
}

export default ejeD;