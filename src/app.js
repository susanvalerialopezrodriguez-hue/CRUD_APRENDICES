const express = require("express");
const ruta = require("path");
require("dotenv").config();

//importar de la carpeta routes. usaremos un archivo que contendra los enrutadores
const enrutador = require("./routes");
const manejadorErrores = require("./middleware/manejadorErrores");
const app = express();

//app usar middleware body-parse
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//servir las imagenes subidas desde la carpeta misimagenes
app.use("/misImagenes", express.static(ruta.join(__dirname, "..", "misimagenes")));

//app usara una ruta predeterminada "/api", con un enrutador
app.use("/api", enrutador);

//endpoint raiz
app.get("/", (req, res) => {
  res.send("Enpoint raiz de nuestra API Rest    ");
});

//manejador de errores, siempre al final
app.use(manejadorErrores);

module.exports = app;