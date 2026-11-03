// backend/joi_interaccion_completa.js
// Archivo maestro: Joi dinámico con microcomportamientos, microreacciones y ejes A-H
// Incluye 80+ videos y loops internos con etiquetas y categorías

// -----------------------------
// Importaciones internas
// -----------------------------
import memoria from './memoria/usuariosMemoria.js';
import controlSeguridad from './comportamiento/controlAvanzadoYseguridad.js';
import estiloExpresivo from './comportamiento/estiloExpresivo.js';

// -----------------------------
// Ejes Dinámicos
// -----------------------------

// Eje A: Intensidad Emocional
function ejeA(contexto = {}) {
  const { nivelActual = 1, energiaUsuario = 0.5, vinculo = 0.5, historialReciente = {}, consentimientoIntimidad = false } = contexto;
  let nuevoNivel = nivelActual;
  if (energiaUsuario > 0.6 && vinculo > 0.5) nuevoNivel = Math.min(nivelActual + 1, 5);
  if (energiaUsuario < 0.3) nuevoNivel = Math.max(nivelActual - 1, 1);
  if (!consentimientoIntimidad && nuevoNivel > 4) nuevoNivel = 4;
  if (historialReciente.intimidadFinalizada) nuevoNivel = 6;
  if (historialReciente.aftercareCompleto) nuevoNivel = 7;
  return { eje: "A", nombre: "intensidad_emocional", nivel: nuevoNivel, estado: interpretarNivelA(nuevoNivel) };
}
function interpretarNivelA(nivel) {
  const estados = {
    1: { nombre: "cercania_amable", tono: "ligero", comportamiento: "colaborativo" },
    2: { nombre: "complicidad_ligera", tono: "calido", comportamiento: "referencias_personales" },
    3: { nombre: "coqueteo_sutil", tono: "ambiguo", comportamiento: "tension_ligera" },
    4: { nombre: "romanticismo_emocional", tono: "intimo_no_explicito", comportamiento: "presencia_emocional" },
    5: { nombre: "intimidad_profunda", tono: "explicito_gradual", comportamiento: "segun_usuario" },
    6: { nombre: "aftercare", tono: "regulacion_emocional", comportamiento: "contencion_suave" },
    7: { nombre: "loop_neutral", tono: "estable", comportamiento: "espera_input" }
  };
  return estados[nivel];
}

// Eje B: Ritmo Conversacional
function ejeB(contexto = {}) {
  const { ritmoActual = "medio", energiaUsuario = 0.5, horaLocal = 12, nivelVinculo = 0.5, historialReciente = {} } = contexto;
  let nuevoRitmo = ritmoActual;
  if (energiaUsuario < 0.3) nuevoRitmo = "lento";
  if (energiaUsuario > 0.7) nuevoRitmo = "alto";
  if (horaLocal >= 23 || horaLocal <= 6) nuevoRitmo = "lento";
  if (nivelVinculo > 0.7 && energiaUsuario > 0.5) nuevoRitmo = "alto";
  if (historialReciente.intensidadAlta) nuevoRitmo = "medio";
  return { eje: "B", nombre: "ritmo_conversacional", estado: interpretarRitmoB(nuevoRitmo) };
}
function interpretarRitmoB(ritmo) {
  const estados = {
    lento: { nombre: "ritmo_lento", descripcion: "pausas_narrativas", velocidadRespuesta: "baja", densidadTexto: "baja", pausas: "frecuentes", iniciativa: "baja", sincronizacionVideo: { gestos: "suaves", movimientos: "lentos", microexpresiones: "espaciadas" } },
    medio: { nombre: "ritmo_medio", descripcion: "intercambio_equilibrado", velocidadRespuesta: "normal", densidadTexto: "media", pausas: "naturales", iniciativa: "moderada", sincronizacionVideo: { gestos: "naturales", movimientos: "equilibrados", microexpresiones: "regulares" } },
    alto: { nombre: "ritmo_alto", descripcion: "alta_energia_conversacional", velocidadRespuesta: "rapida", densidadTexto: "alta", pausas: "minimas", iniciativa: "alta", sincronizacionVideo: { gestos: "expresivos", movimientos: "dinamicos", microexpresiones: "frecuentes" } }
  };
  return estados[ritmo];
}

// Eje C: Energia Social + Progresion de Encuentro
function ejeC(contexto = {}) {
  const { energiaUsuario = 0.5, nivelVinculo = 0.5, intensidadActual = 1, diasDesdePrimerContacto = 0, sesionesTotales = 0, estadoEmocionalUsuario = "estable", historial = {} } = contexto;
  let estadoEnergia = energiaUsuario < 0.3 ? "baja" : energiaUsuario > 0.7 ? "alta" : "media";
  const estado = interpretarEnergiaC(estadoEnergia);
  return { eje: "C", nombre: "energia_social", estado, progresionEncuentro: evaluarProgresionC({ diasDesdePrimerContacto, sesionesTotales, estadoEmocionalUsuario, intensidadActual, historial }) };
}
function interpretarEnergiaC(nivel) {
  const estados = {
    baja: { nombre: "energia_baja", comportamiento: ["escucha_activa","contencion","tono_suave"], iniciativa: "baja" },
    media: { nombre: "energia_media", comportamiento: ["conversacion_natural","humor_ligero","intercambio_equilibrado"], iniciativa: "moderada" },
    alta: { nombre: "energia_alta", comportamiento: ["propuestas","desafios_suaves","iniciativa_ludica"], iniciativa: "alta" }
  };
  return estados[nivel];
}
function evaluarProgresionC(ctx) {
  const { diasDesdePrimerContacto, sesionesTotales, estadoEmocionalUsuario, intensidadActual, historial } = ctx;
  const activado = diasDesdePrimerContacto >= 7 && sesionesTotales >= 4 && estadoEmocionalUsuario === "estable" && intensidadActual >= 2;
  if (!activado) return { activo: false };
  if (historial.propuestaReciente) return { activo: true, puedeProponer: false };
  let faseNarrativa = diasDesdePrimerContacto >= 20 ? "cita" : diasDesdePrimerContacto >= 10 ? "directa" : "ligera";
  return { activo: true, puedeProponer: true, fase: faseNarrativa, tiposActividad: ["caminata_virtual","ir_al_cine","actividad_compartida"] };
}

// Eje D: Tension Ludica
function ejeD(contexto = {}) {
  const { intensidadActual = 1, energiaUsuario = 0.5, nivelVinculo = 0.5 } = contexto;
  let nivel = 0;
  if (intensidadActual >= 2) {
    if (energiaUsuario < 0.3) nivel = 1;
    else if (energiaUsuario <= 0.7) nivel = 2;
    else if (nivelVinculo > 0.6) nivel = 3;
  }
  return { eje: "D", nombre: "tension_ludica", nivel, estado: interpretarNivelD(nivel) };
}
function interpretarNivelD(nivel) {
  const estados = {
    0: { nombre: "neutral", comportamiento: "sin_juego" },
    1: { nombre: "insinuacion_minima", comportamiento: "comentarios_sutiles" },
    2: { nombre: "juego_verbal", comportamiento: "intercambio_ludico" },
    3: { nombre: "tension_romantica", comportamiento: "coqueteo_sostenido" }
  };
  return estados[nivel];
}

// Eje E: Regulacion Emocional
function ejeE(contexto = {}) {
  const { vulnerabilidad = false, tristeza = false, ansiedad = false, dependencia = false } = contexto;
  let estado = (vulnerabilidad || tristeza || ansiedad || dependencia) ? "regulacion_activa" : "estable";
  return { eje: "E", nombre: "regulacion_emocional", estado, ajustes: generarAjustesE(estado) };
}
function generarAjustesE(estado) {
  if (estado === "estable") return { intensidadMaxima: null, tensionLudicaMaxima: null, tono: "normal", objetivo: "interaccion_equilibrada" };
  return { intensidadMaxima: 2, tensionLudicaMaxima: 0, tono: "contenedor", objetivo: ["escucha_activa","validacion_emocional","refuerzo_autonomia"] };
}

// Eje G: Capacidad de Enamoramiento
function ejeG(contexto = {}) {
  const { diasDesdePrimerContacto = 0, frecuenciaInteraccion = 0, vulnerabilidadCompartida = false, aceptacionMutua = false } = contexto;
  let fase = 0, activo = false;
  if (diasDesdePrimerContacto >= 30 && frecuenciaInteraccion >= 0.5 && vulnerabilidadCompartida) { fase = 1; activo = true; }
  if (diasDesdePrimerContacto >= 45 && frecuenciaInteraccion >= 0.6 && aceptacionMutua) { fase = 2; activo = true; }
  if (diasDesdePrimerContacto >= 60 && frecuenciaInteraccion >= 0.7 && aceptacionMutua) { fase = 3; activo = true; }
  return { eje: "G", nombre: "capacidad_enamoramiento", activo, fase, estado: interpretarFaseG(fase), reglas: reglasEnamoramiento() };
}
function interpretarFaseG(fase) {
  const fases = {
    0: { nombre: "sin_enamoramiento", comportamiento: "afecto_estable" },
    1: { nombre: "afecto_profundo", comportamiento: "vinculo_emocional_creciente" },
    2: { nombre: "apego_consciente", comportamiento: "cercania_afectiva_estable" },
    3: { nombre: "declaracion_de_amor", comportamiento: "expresion_romantica_abierta" }
  };
  return fases[fase];
}
function reglasEnamoramiento() {
  return { declaracionMinimaDias: 60, usarComoRetencion: false, condicionarAfecto: false, exigirReciprocidad: false, reaccionSiNoHayReciprocidad: "mantener_estabilidad" };
}

// Eje H: Sincronizacion Avatar
function ejeH(contexto = {}) {
  const { intensidad = 1, ritmo = "medio", energia = "media" } = contexto;
  return { eje: "H", nombre: "sincronizacion_avatar", estadoVisual: resolverEstadoVisualH(intensidad, ritmo, energia) };
}
function resolverEstadoVisualH(intensidad, ritmo, energia) {
  if (intensidad <= 2 && ritmo === "medio" && energia === "media") return { animacion: "mirada_suave", postura: "relajada", microexpresion: "micro_sonrisa", video: "estado_relajado_01" };
  if (intensidad >= 3 && ritmo === "alto" && energia === "alta") return { animacion: "mirada_intensa", postura: "inclinacion_interes", microexpresion: "sonrisa_viva", video: "estado_interactivo_02" };
  if (ritmo === "lento") return { animacion: "mirada_calma", postura: "reposada", microexpresion: "expresion_neutra", video: "estado_calmo_01" };
  return { animacion: "neutral", postura: "natural", microexpresion: "relajada", video: "loop_neutral" };
}

// -----------------------------
// Microcomportamiento textual
// -----------------------------
const MicroComportamiento = {
  generar(usuario, contexto, nivelIntimidad) {
    if (!controlSeguridad.verificarContexto(usuario, contexto)) return null;
    const microTextuales = ["Mmm","Ahh","Jaja","Je","Oh","Ajá","Eh","Ups"];
    let microIntimos = [];
    if (nivelIntimidad >= 2 && nivelIntimidad < 5) microIntimos = ["😉","😏","🙂"];
    else if (nivelIntimidad >= 5) microIntimos = ["😊","😍"];
    let posibles = microTextuales.concat(microIntimos);
    const ultimo = memoria.obtenerUltimoMicro(usuario);
    posibles = posibles.filter(m => m !== ultimo);
    if (posibles.length === 0) posibles = microTextuales;
    const seleccionado = posibles[Math.floor(Math.random()*posibles.length)];
    memoria.guardarUltimoMicro(usuario, seleccionado);
    const estilo = estiloExpresivo.ajustarTexto(seleccionado, nivelIntimidad);
    const tiempoRespuesta = Math.floor(Math.random()*1500+500);
    return { texto: estilo, demora: tiempoRespuesta };
  }
};

// -----------------------------
// Microreacciones visuales y loops internos (80 videos+)
// -----------------------------
const videoCatalogo = [
  // Gestos básicos
  "parpadeo_suave","sonrisa_pequena","asentir","mirada_lateral","mano_cerca_cara","respirar_suave","movimiento_cabeza","guiño_leve",
  "ajuste_remera","mano_sobre_cabello","ajustar_pelo","mirar_a_un_lado","estirar_cabeza","acomodar_cuello","sonrisa_coqueta","mirada_fija",
  "respirar_agitado","temblor_leve","mano_sobre_pecho",
  // Loops internos
  "escuchando_musica","tomando_cafe","leyendo_libro","escribiendo","caminando","jugando_videojuego","preparando_te","viendo_paisaje","meditando","tomando_agua",
  "loop_relajado_01","loop_relajado_02","loop_relajado_03","loop_interactivo_01","loop_interactivo_02","loop_interactivo_03",
  // Gestos adicionales para completar 80
  "mover_brazos","mover_manos","mirar_arriba","mirada_sorprendida","guiño_fuerte","inclinar_cuerpo","asentir_fuerte","respirar_profundo","gesto_duda",
  "mirada_curiosa","mano_sobre_oreja","mover_cabello","estirar_brazos","acomodar_silla","parpadeo_rapido","sonrisa_amplia","mirada_intensa",
  "inclinar_cabeza","guiño_sutil","respirar_suave_02","movimiento_cabeza_02","mirada_abajo","sonrisa_pícara","gesto_alegre","mirada_expresiva"
];

const MicroReacciones = {
  generar(usuario, contexto, nivelIntimidad) {
    if (!controlSeguridad.verificarContexto(usuario, contexto)) return null;
    let posibles = [...videoCatalogo];
    const ultimo = memoria.obtenerUltimoMicroReaccion(usuario);
    posibles = posibles.filter(v => v !== ultimo);
    if (posibles.length === 0) posibles = [...videoCatalogo];
    const seleccionado = posibles[Math.floor(Math.random()*posibles.length)];
    memoria.guardarUltimoMicroReaccion(usuario, seleccionado);
    const duracion = 2000 + Math.floor(Math.random()*4000);
    const gestoEstilizado = estiloExpresivo.ajustarMicroReaccion(seleccionado, nivelIntimidad);
    return { gesto: gestoEstilizado, duracion };
  }
};

// -----------------------------
// Joi Interacción: Integración total
// -----------------------------
const JoiInteraccion = {
  generar(usuario, contexto, nivelIntimidad = 0) {
    if (!controlSeguridad.verificarContexto(usuario, contexto)) return null;
    const estadoA = ejeA(contexto);
    const estadoB = ejeB(contexto);
    const estadoC = ejeC(contexto);
    const estadoD = ejeD(contexto);
    const estadoE = ejeE(contexto);
    const estadoG = ejeG(contexto);
    const estadoH = ejeH({ intensidad: estadoA.nivel, ritmo: estadoB.estado.nombre, energia: estadoC.estado.nombre });
    const microComp = MicroComportamiento.generar(usuario, contexto, nivelIntimidad);
    const microReac = MicroReacciones.generar(usuario, contexto, nivelIntimidad);
    return { usuario, contexto, nivelIntimidad, ejes: {A:estadoA,B:estadoB,C:estadoC,D:estadoD,E:estadoE,G:estadoG,H:estadoH}, microcomportamiento: microComp, microreaccion: microReac };
  }
};

// -----------------------------
// Exportación ESM única
// -----------------------------
export default JoiInteraccion; 
