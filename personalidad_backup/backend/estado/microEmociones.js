// motor/microemociones.js

// Función que retorna microexpresiones según el estado emocional
function microExpresion(estado) {
    const micro = {
        feliz: ["sonrisa", "brillo en ojos"],
        triste: ["ceño fruncido", "mirada baja"],
        enojado: ["ceño fruncido", "resoplido"],
        neutral: ["mirada neutra"]
    };
    return micro[estado] || ["mirada neutra"];
}

// Exportación ESM
export default { microExpresion };