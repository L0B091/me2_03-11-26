// micro_comportamiento.js
// Objetivo: Generar microcomportamientos naturales, aleatorios y coherentes para Joi

// -----------------------------
// Importaciones ESM internas
// -----------------------------
import memoria from '../memoria/usuariosMemoria.js';
import estiloExpresivo from './estiloExpresivo.js';
import ritmo from './ritmoConversacional.js';
import controlSeguridad from './controlAvanzadoYseguridad.js';

// -----------------------------
// Objeto principal
// -----------------------------
const MicroComportamiento = {
  generar(usuario, contexto, nivelIntimidad = 1) {
    // -----------------------------
    // Validación básica
    // -----------------------------
    nivelIntimidad = Math.max(1, Math.min(nivelIntimidad, 7));

    // Verifica límites de seguridad y contexto
    if (!controlSeguridad.verificarContexto(usuario, contexto)) return null;

    // -----------------------------
    // Microcomportamientos textuales básicos
    // -----------------------------
    const microTextuales = ["Mmm", "Ahh", "Jaja", "Je", "Oh", "Ajá", "Eh", "Ups"];

    // -----------------------------
    // Microcomportamientos íntimos según nivel
    // -----------------------------
    let microIntimos = [];
    if (nivelIntimidad >= 2 && nivelIntimidad < 5) {
      microIntimos = ["😉", "😏", "🙂"];
    } else if (nivelIntimidad >= 5) {
      microIntimos = ["😊", "😍"];
    }

    // -----------------------------
    // Combina todas las opciones y evita repetición inmediata
    // -----------------------------
    let posibles = microTextuales.concat(microIntimos);
    const ultimo = memoria.obtenerUltimoMicro(usuario);
    posibles = posibles.filter(m => m !== ultimo);
    if (posibles.length === 0) posibles = microTextuales;

    // -----------------------------
    // Selección aleatoria
    // -----------------------------
    const indice = Math.floor(Math.random() * posibles.length);
    const seleccionado = posibles[indice];

    // Guarda en memoria para evitar repetición inmediata
    memoria.guardarUltimoMicro(usuario, seleccionado);

    // -----------------------------
    // Ajuste de estilo y cálculo de demora
    // -----------------------------
    const estilo = estiloExpresivo.ajustarTexto(seleccionado, nivelIntimidad);
    const tiempoRespuesta = ritmo.calcularDemora(usuario, contexto);

    // -----------------------------
    // Retorno final
    // -----------------------------
    return {
      texto: estilo,
      demora: tiempoRespuesta
    };
  }
};

// -----------------------------
// Exportación ESM
// -----------------------------
export default MicroComportamiento;