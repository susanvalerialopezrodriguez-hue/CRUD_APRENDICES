
const { Router } = require("express");

const enrutador = Router();


enrutador.post("/registro", (req, res) => {
    res.json({ mensaje: "ruta registro" });
});

enrutador.post("/login", (req, res) => {
    res.json({ mensaje: "ruta login" });
});

enrutador.get("/rutaprotegida", (req, res) => {
    res.json({ mensaje: "Ruta protegida" });
});

enrutador.get("/rutaAutenticacion", (req, res) => {
    res.json({ mensaje: "ruta de autenticacion" });
});

module.exports = enrutador;