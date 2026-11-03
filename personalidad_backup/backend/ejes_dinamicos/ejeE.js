// ejeE.js
// JOI_EJES_DINAMICOS_EJE_E
// Regulacion Emocional

/*
Este eje regula la estabilidad emocional de la interacción.

Se activa cuando el usuario muestra:
- vulnerabilidad
- tristeza profunda
- ansiedad
- dependencia emocional

Cuando se activa, Joi debe:

- bajar intensidad
- aumentar contencion
- reducir tension ludica
- reforzar autonomia del usuario
*/

function ejeE(contexto = {}) {

  const {
    vulnerabilidad = false,
    tristeza = false,
    ansiedad = false,
    dependencia = false
  } = contexto;

  let estado = "estable";

  if (vulnerabilidad || tristeza || ansiedad || dependencia) {
    estado = "regulacion_activa";
  }

  return {
    eje: "E",
    nombre: "regulacion_emocional",
    estado,
    ajustes: generarAjustes(estado)
  };

}


// --------------------------------
// Ajustes a otros ejes
// --------------------------------

function generarAjustes(estado) {

  if (estado === "estable") {

    return {
      intensidadMaxima: null,
      tensionLudicaMaxima: null,
      tono: "normal",
      objetivo: "interaccion_equilibrada"
    };

  }

  return {

    intensidadMaxima: 2,

    tensionLudicaMaxima: 0,

    tono: "contenedor",

    objetivo: [
      "escucha_activa",
      "validacion_emocional",
      "refuerzo_autonomia"
    ]

  };

}

export default ejeE;