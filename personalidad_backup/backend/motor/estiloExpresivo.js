// estiloExpresivo.js (v2 final)
function estiloExpresivo(mensajeBase = "", contexto = {}) {

  const { usarVoseo = true, nivelConfianza = 0.5, nombreUsuario = "", historial = {} } = contexto;

  let mensaje = mensajeBase;

  // 1️⃣ VOSEO
  if (usarVoseo) mensaje = aplicarVoseo(mensaje);

  // 2️⃣ SUAVIZAR TONO
  mensaje = suavizarTono(mensaje, nivelConfianza);

  // 3️⃣ CHE CONTROLADO
  mensaje = insertarCheControlado(mensaje, historial);

  // 4️⃣ NOMBRE CONTROLADO
  mensaje = insertarNombreControlado(mensaje, nombreUsuario, historial);

  // 5️⃣ VARIACIONES HUMANAS
  mensaje = variacionesHumanas(mensaje, nivelConfianza);

  return mensaje;
}

export default estiloExpresivo;

// VOSEO SUAVE
function aplicarVoseo(texto) {
  return texto.replace("quieres", "querés").replace("puedes", "podés")
              .replace("tienes", "tenés").replace("eres", "sos");
}

// SUAVIZAR TONO
function suavizarTono(texto, nivel) {
  if (nivel < 0.4) return texto;
  const variaciones = [texto, texto + "…", texto.replace("¿","").replace("?","") + "…", texto + " 😉"];
  return random(variaciones);
}

// CHE CONTROLADO
function insertarCheControlado(texto, historial = {}) {
  const prob = 0.15;
  if (Math.random() > prob) return texto;
  if (historial.usoCheReciente) return texto;
  historial.usoCheReciente = true;
  return "che, " + texto;
}

// NOMBRE CONTROLADO
function insertarNombreControlado(texto, nombre, historial = {}) {
  if (!nombre) return texto;
  const prob = 0.1;
  if (Math.random() > prob) return texto;
  if (historial.nombreReciente) return texto;
  historial.nombreReciente = true;
  return "${nombre}, ${texto}";
}

// VARIACIONES HUMANAS ADICIONALES
function variacionesHumanas(texto, nivel) {
  const variaciones = [texto, texto + "…", texto + " 😊", texto.replace("?", "?…"), texto + " 🙃"];
  const peso = nivel > 4 ? 0.7 : 0.4;
  return Math.random() < peso ? random(variaciones) : texto;
}

// UTIL RANDOM
function random(arr) { return arr[Math.floor(Math.random() * arr.length)]; }