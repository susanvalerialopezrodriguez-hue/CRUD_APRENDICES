//rutas de usuarios
const { Router } = require("express");

const { registrar, ingresar, rutaProtegida } = require("../controllers/usuariosController");
const autenticarToken = require("../middlewares/authMiddleware");

const enrutador = Router();

enrutador.post("/registro", registrar);
enrutador.post("/login", ingresar);
enrutador.get("/rutaprotegida", autenticarToken, rutaProtegida);

module.exports = enrutador;
