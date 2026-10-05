/**
 * Funciones de autenticación (JWT).
 */
const jwt = require('jsonwebtoken');
const config = require('../config/db');

/**
 * Middleware que protege rutas: exige un token Bearer válido.
 * Si es válido, guarda los datos decodificados en req.usuario.
 */
function autenticar(req, res, next) {
    const cabecera = req.headers.authorization || '';
    const token = cabecera.split(' ')[1];

    if (!token) {
        return res.status(401).json({ Error: 'Acceso denegado, no se proveyó un token' });
    }

    jwt.verify(token, config.jwtSecret, (error, decoded) => {
        if (error) {
            return res.status(403).json({ Error: 'Token inválido o expirado' });
        }
        req.usuario = decoded;
        next();
    });
}

/**
 * Genera un token JWT para un usuario.
 * @param {{id: number, nombre: string, rol?: string}} usuario
 * @returns {string} token firmado
 */
function generarToken(usuario) {
    return jwt.sign(
        { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
        config.jwtSecret,
        { expiresIn: config.jwtExpira }
    );
}

module.exports = autenticar;
module.exports.generarToken = generarToken;
