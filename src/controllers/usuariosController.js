//importar servicio
const ingresarUsuario = require('../services/usuariosService');
const listarUsuarios = async (req, res) => {
    res.json({"mensaje": "listado de usuarios"});
}

module.exports = listarUsuarios
