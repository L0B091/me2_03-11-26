// emociones.js
// Define el manejo de emociones de los usuarios y su evolución en la conversación

// Registro de estados por usuario
const estadosUsuarios = {};

// Estado inicial por defecto
const estadoBase = "neutral";

/**
 * Obtener el estado emocional actual de un usuario.
 * Si no existe, inicializa con estadoBase.
 * @param {string} usuarioId
 * @returns {string} estado actual
 */
function obtenerEstado(usuarioId) {
    if (!estadosUsuarios[usuarioId]) {
        estadosUsuarios[usuarioId] = estadoBase;
    }
    return estadosUsuarios[usuarioId];
}

/**
 * Actualizar el estado emocional del usuario.
 * Maneja transiciones suaves entre emociones.
 * @param {string} usuarioId
 * @param {string} nuevoEstado
 * @returns {string} estado final
 */
function actualizarEstado(usuarioId, nuevoEstado) {
    const estadoActual = obtenerEstado(usuarioId);

    // Si no cambia, mantener
    if (estadoActual === nuevoEstado) return estadoActual;

    // Transición simple: de triste a feliz o viceversa pasa por neutral
    if ((nuevoEstado === "triste" && estadoActual === "feliz") ||
        (nuevoEstado === "feliz" && estadoActual === "triste")) {
        estadosUsuarios[usuarioId] = "neutral";
    } else {
        estadosUsuarios[usuarioId] = nuevoEstado;
    }

    return estadosUsuarios[usuarioId];
}

/**
 * Calcular un nuevo estado según contexto o señales.
 * Puede expandirse para emociones más complejas.
 * @param {string} usuarioId
 * @param {object} señales - datos del mensaje o contexto
 * @returns {string} estado calculado
 */
function calcularEstado(usuarioId, señales = {}) {
    // Por ahora, solo usa señales.tipoEmocion si está
    if (señales.tipoEmocion) {
        return actualizarEstado(usuarioId, señales.tipoEmocion);
    }
    // Si no hay señales, retorna estado actual
    return obtenerEstado(usuarioId);
}

// Exportación ESM para compatibilidad con import … from
export default {
    obtenerEstado,
    actualizarEstado,
    calcularEstado
};