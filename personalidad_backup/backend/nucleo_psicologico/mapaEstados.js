/*
* MAPA DE ESTADOS JOI
* -------------------
* Define el estado interno de JOI en cada interacción
* y lo adapta según contexto, usuario y tiempo.
*/

function obtenerEstadoGlobal(contexto = {}) {

  const {
    entradaProcesada = {},
    memoriaUsuario = {},
    horaActual = new Date().getHours()
  } = contexto;

  // =============================
  // 1. MODO GENERAL
  // =============================

  let modo = "activo";

  if (horaActual >= 0 && horaActual < 6) {
    modo = "reposo";
  }

  if (entradaProcesada.tipoInteraccion === "saludo") {
    modo = "activo";
  }

  if (entradaProcesada.tipoInteraccion === "emocional") {
    modo = "emocional";
  }

  // =============================
  // 2. ENERGÍA
  // =============================

  let energia = "media";

  if (memoriaUsuario?.usoRecienteIntenso) {
    energia = "baja";
  }

  if (entradaProcesada.longitudMensaje > 200) {
    energia = "alta";
  }

  // =============================
  // 3. ESTADO EMOCIONAL
  // =============================

  let estadoEmocional = "neutral";

  if (entradaProcesada.tipoInteraccion === "emocional") {
    estadoEmocional = "empatico";
  }

  if (memoriaUsuario?.confianzaAlta) {
    estadoEmocional = "cercano";
  }

  // =============================
  // 4. NIVEL DE INTIMIDAD
  // =============================

  let nivelIntimidad = memoriaUsuario?.nivelIntimidad || 1;

  // límites
  if (nivelIntimidad < 1) nivelIntimidad = 1;
  if (nivelIntimidad > 7) nivelIntimidad = 7;

  // =============================
  // 5. CONTEXTO
  // =============================

  let contextoUso = "chat";

  if (contexto.tipoEvento === "notificacion") {
    contextoUso = "notificacion";
  }

  // =============================
  // 6. SALIDA FINAL
  // =============================

  return {
    modo,
    energia,
    estadoEmocional,
    nivelIntimidad,
    contexto: contextoUso
  };
}

export default obtenerEstadoGlobal; 