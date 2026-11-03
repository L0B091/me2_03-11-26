// backend/motor/procesadorEntrada.js
// CAPA DE ENTRADA UNIFICADA Y OPTIMIZADA

/**
* Limpieza básica del texto
*/
function limpiarTexto(texto = "") {
  return texto
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
* Detecta intención principal del usuario
*/
function detectarIntencion(texto = "") {

  if (!texto) return "neutral";

  if (texto.includes("?")) return "pregunta";

  if (
    texto.includes("hola") ||
    texto.includes("buenas") ||
    texto.includes("hey")
  ) return "saludo";

  if (texto.includes("gracias")) return "agradecimiento";

  if (
    texto.includes("chau") ||
    texto.includes("adios")
  ) return "despedida";

  return "comentario";
}

/**
* Detecta estado emocional básico
*/
function detectarEmocion(texto = "") {

  if (!texto) return "neutral";

  if (
    texto.includes("triste") ||
    texto.includes("mal") ||
    texto.includes("cansado")
  ) return "triste";

  if (
    texto.includes("feliz") ||
    texto.includes("genial") ||
    texto.includes("contento")
  ) return "feliz";

  if (
    texto.includes("enojado") ||
    texto.includes("molesto")
  ) return "enojado";

  return "neutral";
}

/**
* Calibración del usuario (nivel de energía e interacción)
*/
function calibrarUsuario(mensaje = "", historial = []) {

  const longitud = mensaje.length;

  let energia = "media";

  if (longitud < 20) energia = "baja";
  if (longitud > 120) energia = "alta";

  const texto = mensaje.toLowerCase();

  let tipoInteraccion = "neutral";

  if (texto.includes("?")) tipoInteraccion = "pregunta";
  if (texto.includes("hola") || texto.includes("buenas")) tipoInteraccion = "saludo";

  return {
    energia,
    tipoInteraccion,
    longitudMensaje: longitud,
    cantidadHistorial: historial.length
  };
}

/**
* PIPELINE PRINCIPAL DE ENTRADA
*/
function procesarEntrada(usuarioId, mensaje = "", historial = []) {

  const limpio = limpiarTexto(mensaje);

  return {
    usuarioId,

    textoOriginal: mensaje,
    textoNormalizado: limpio,

    intencion: detectarIntencion(limpio),
    emocion: detectarEmocion(limpio),

    calibracion: calibrarUsuario(mensaje, historial),

    timestamp: Date.now()
  };
}

export default {
  procesarEntrada
}; 
