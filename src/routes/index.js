const { Router } = require("express");
const autenticarRouter = require("./autenticarRouter");
const usuariosRouter = require("./usuarios");
const pruebaRouter = require("./pruebaRouter");
const enrutador = Router();

//enrutador
enrutador.use("/listado", usuariosRouter);
enrutador.use("/autenticar", autenticarRouter);
enrutador.use("/rutaPrueba", pruebaRouter);

module.exports = enrutador;