/*
* COGNICIÓN.JS 
*/

async function cognicion(mensajeUsuario, contexto = {}) {

  // =========================================================
  // 1. VALIDACIÓN + NORMALIZACIÓN DE CONTEXTO
  // =========================================================

  const entrada = contexto.entradaProcesada;

  if (!entrada) {
    return {
      respuesta: "Error interno: entrada no procesada.",
      seleccion: null,
      contextoFinal: contexto
    };
  }

  //  NUEVO: MEMORIA SISTEMA
  const memoriaSistema = contexto.memoriaSistema || null;

  const memoriaCorta = memoriaSistema?.memoriaCorta;
  const memoriaSelectiva = memoriaSistema?.memoriaSelectiva;
  const recuerdosImportantes = memoriaSistema?.recuerdosImportantes;
  const datosUsuario = memoriaSistema?.datosUsuario;

  const ctx = {
    tipoInteraccion: entrada.tipoInteraccion || "neutral",
    energiaUsuario: entrada.energiaUsuario || "media",
    emocionDetectada: entrada.emocionDetectada || "neutral",
    estadoEmocional:
      contexto.estadoEmocional ||
      entrada.emocionDetectada ||
      "neutral",

    //  NUEVO: INYECCIÓN DE MEMORIA
    memoriaCorta,
    memoriaSelectiva,
    recuerdosImportantes,
    datosUsuario,

    ...contexto
  };

  // =========================================================
  // 2. CARGA DE OPCIONES
  // =========================================================

  let opciones = ctx.opciones;

  if (!Array.isArray(opciones) || opciones.length === 0) {
    opciones = [
      { tipo: "informativa", texto: "Puedo ayudarte con eso." },
      { tipo: "neutral", texto: "Entiendo lo que decís." },
      { tipo: "breve", texto: "Ok." }
    ];
  }

  // =========================================================
  //  NUEVO: CONTEXTO COGNITIVO DE MEMORIA
  // =========================================================

  const focoMemoria = memoriaCorta?.foco || "general";
  const hayRecuerdos = recuerdosImportantes
    ? Object.keys(recuerdosImportantes).length > 0
    : false;

  // =========================================================
  // 3. DECISIÓN POR SCORING
  // =========================================================

  function puntuar(op) {
    let score = 0;

    if (op.tipo === "informativa" && ctx.tipoInteraccion === "pregunta") {
      score += 4;
    }

    if (op.tipo === "breve" && ctx.energiaUsuario === "baja") {
      score += 3;
    }

    if (op.tipo === "neutral") {
      score += 1;
    }

    if (ctx.estadoEmocional === "intenso" && op.tipo === "neutral") {
      score += 1;
    }

    //  NUEVO: INFLUENCIA DE MEMORIA
    if (focoMemoria === "negocio" && op.tipo === "informativa") {
      score += 2;
    }

    if (focoMemoria === "ia" && op.tipo === "informativa") {
      score += 2;
    }

    if (hayRecuerdos && op.tipo === "informativa") {
      score += 1;
    }

    return score;
  }

  const seleccionado = opciones
    .map(op => ({ op, score: puntuar(op) }))
    .sort((a, b) => b.score - a.score)[0];

  let seleccion = seleccionado?.op;

  let respuesta =
    typeof seleccion === "string"
      ? seleccion
      : seleccion?.texto || "No estoy segura de cómo responder a eso.";

  // =========================================================
  //  NUEVO: ENRIQUECER RESPUESTA CON MEMORIA
  // =========================================================

  if (memoriaCorta?.intencionDetectada === "proyecto") {
    respuesta += " (lo estoy analizando dentro de tu contexto de proyecto)";
  }

  if (hayRecuerdos) {
    respuesta += " (tengo contexto previo relevante)";
  }

  // =========================================================
  // 4. SEGURIDAD (PRE-PROCESAMIENTO)
  // =========================================================

  const regexBloqueo = /(hackear|actividad ilegal|violencia extrema)/i;

  if (regexBloqueo.test(respuesta)) {

    const respuestasSeguras = [
      "Prefiero no entrar en ese tema.",
      "Ese tipo de contenido no es algo que pueda discutir.",
      "Mejor cambiemos a otro tema."
    ];

    respuesta =
      respuestasSeguras[
        Math.floor(Math.random() * respuestasSeguras.length)
      ];
  }

  // =========================================================
  // 5. COHERENCIA DEL PERSONAJE
  // =========================================================

  const reglas = ctx.reglas || {};

  if (reglas.evitarMemoriaInexistente) {
    respuesta = respuesta.replace(
      /(recuerdo|la ultima vez|como hablamos antes|como te dije antes)/gi,
      ""
    );
  }

  if (ctx.estadoEmocional === "neutral") {
    respuesta = respuesta.replace(
      /(estoy muy emocionada|esto es increible|no puedo creerlo)/gi,
      "me parece interesante"
    );
  }

  if (ctx.contradiccionDetectada) {
    respuesta = "Creo que me exprese mal. Dejame reformular eso.";
  }

  // limpieza final
  respuesta = respuesta.replace(/\s+/g, " ").trim();

  // =========================================================
  // 6. SALIDA
  // =========================================================

  return {
    respuesta,
    seleccion,
    contextoFinal: ctx
  };
}

export default cognicion; 
