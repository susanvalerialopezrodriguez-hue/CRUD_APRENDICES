/**
 * Valida que el correo tenga un formato correcto.
 * @param {string} correo
 * @returns {boolean}
 */
function validarCorreo(correo) {
    if (typeof correo !== 'string') return false;
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexCorreo.test(correo.trim());
}

/**
 * Valida que el nombre sea un string con más de 3 caracteres.
 * @param {string} nombre
 * @returns {boolean}
 */
function validarNombre(nombre) {
    if (typeof nombre !== 'string') return false;
    return nombre.trim().length > 3;
}

/**
 * Valida el objeto completo del aprendiz y devuelve un resultado
 * con los errores encontrados.
 * @param {{nombre?: string, correo?: string}} datoAprendiz
 * @returns {{esValido: boolean, errores: string[]}}
 */
function validarAprendiz(datoAprendiz) {
    const errores = [];

    if (!validarNombre(datoAprendiz.nombre)) {
        errores.push('El nombre debe tener más de 3 caracteres.');
    }

    if (!validarCorreo(datoAprendiz.correo)) {
        errores.push('El correo no tiene un formato válido.');
    }

    return {
        esValido: errores.length === 0,
        errores
    };
}

module.exports = {
    validarCorreo,
    validarNombre,
    validarAprendiz
};