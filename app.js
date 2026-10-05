const express = require("express");
require("dotenv/config");

const app = express();
const registroMiddleware = require("./src/middleware/registroMiddleware");
const manejoErrMiddleware = require("./src/middleware/manejadorErrores");
const autenticacionMiddle = require("./src/middleware/autenticacion");
const jwtoken = require("jsonwebtoken");

//middleware validar informacion json y form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(registroMiddleware);

const PORT = process.env.PORT || 3000;
//datos para leer archivo
//const listaAprendices = require("./aprendices.json");//manera sincrona
const sisArchivo = require("fs");
const ruta = require("path");
const rutaArchivoJson = ruta.join(__dirname, "listaDatos.json");
//asegurar que exista la carpeta de imagenes subidas
sisArchivo.mkdirSync(ruta.join(__dirname, "imagenes"), { recursive: true });

//servir el frontend (public)
app.use(express.static(ruta.join(__dirname, "public")));
//libreria para cargar imagenes
const multer = require("multer");

//configuracion de almacenamiento
const almacenamiento = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "imagenes/");
  },
  filename: (req, file, cb) => {
    const extension = ruta.extname(file.originalname);
    cb(null, `${Date.now()}${extension}`);
  },
});

const cargar = multer({ storage: almacenamiento });

//middleware, se ejecuta c/que se realiza una peticion, no tiene ruta.
app.use((req, res, next) => {
  const tiempoEnMilisegundos = Date.now();
  const fechaGMT = new Date(tiempoEnMilisegundos);
  console.log(`"Milesegundos": ${tiempoEnMilisegundos}
  "Fecha": ${fechaGMT}`);
  next();
});

//middleware registro, registrar que peticion se hizo
//se realizo el codigo aqui

app.use(registroMiddleware);

//ENDPOINTS
app.get("/", (req, res) => {
  res.send("Api de aprendices.");
});

//listar todos los aprendices
app.get("/api/aprendices", (req, res) => {
  sisArchivo.readFile(rutaArchivoJson, "utf-8", (err, datos) => {
    if (err) {
      return res.status(500).json({ error: "Error conexion bd." });
    }
    const listaAprendices = JSON.parse(datos);
    res.json(listaAprendices);
  });
});

//listar un aprendiz, existe un bug con >0
app.get(["/api/aprendiz", "/api/aprendiz/:dni"], (req, res) => {
  const aprendizCc = req.params.dni || 10001;
  //res.send(`EL aprendiz tiene el numero de identifiacion: ${aprendizCc}`);
  sisArchivo.readFile(rutaArchivoJson, "utf-8", (err, datos) => {
    if (err) {
      return res.status(500).json({ Error: "Error conexion bd." });
    }
    const aprendiz = JSON.parse(datos).find((a) => a.dni == aprendizCc);
    res.json({ Aprendiz: aprendiz ? aprendiz : "sin datos" });
  });
});

//adicionar un aprendiz
app.post("/api/aprendices", cargar.single("imagen"), (req, res) => {
  //en este endpoint falta validar datos como correo
  //capturar datos del nuevo aprendiz
  const nuevoAprendiz = req.body;
  if (!nuevoAprendiz) {
    return res.status(400).json({ Error: "No se enviaron datos" });
  }
  //asignar el siguiente dni disponible si no viene uno
  sisArchivo.readFile(rutaArchivoJson, "utf-8", (err, datos) => {
    if (err) {
      return res.json({ Error: "Error conexin bd." });
    }
    const lista = JSON.parse(datos);
    nuevoAprendiz.avatar = req.file
      ? `/imagenes/${req.file.filename}`
      : "sin imagen";
    if (!nuevoAprendiz.dni) {
      const maxDni = lista.reduce((max, a) => Math.max(max, Number(a.dni) || 0), 0);
      nuevoAprendiz.dni = maxDni + 1;
    }
    lista.push(nuevoAprendiz);
    sisArchivo.writeFile(
      rutaArchivoJson,
      JSON.stringify(lista, null, 2),
      (err) => {
        if (err) {
          return res.json({ Error: "Error al guardar el usuario." });
        }
        res.status(201).json({ Aprendiz: nuevoAprendiz });
      },
    );
  });
});

//editar el aprendiz
app.patch("/api/aprendices/:dni", (req, res) => {
  const aprendizCc = parseInt(req.params.dni, 10);
  const datosModificar = req.body;
  console.log(aprendizCc, datosModificar);
  sisArchivo.readFile(rutaArchivoJson, "utf-8", (err, datos) => {
    if (err) {
      return res.status(500).json({ Error: "Error conexion bd." });
    }
    let listaAprendices = JSON.parse(datos);
    listaAprendices = listaAprendices.map((a) =>
      a.dni === aprendizCc ? { ...a, ...datosModificar } : a,
    );
    sisArchivo.writeFile(
      rutaArchivoJson,
      JSON.stringify(listaAprendices, null, 2),
      (err) => {
        if (err) {
          return res
            .status(500)
            .json({ Error: "Error al actualizar usuario." });
        }
        res.status(200).json(datosModificar);
      },
    );
  });
});

//eliminar un aprendiz
app.delete("/api/aprendices/:dni", (req, res) => {
  const aprendizCc = parseInt(req.params.dni, 10);
  sisArchivo.readFile(rutaArchivoJson, "utf-8", (err, datos) => {
    if (err) {
      return res.status(500).json({ Error: "Error conexion bd." });
    }
    const listaAprendices = JSON.parse(datos).filter((a) => a.dni !== aprendizCc);
    sisArchivo.writeFile(
      rutaArchivoJson,
      JSON.stringify(listaAprendices, null, 2),
      (err) => {
        if (err) {
          return res.status(500).json({ Error: "Error al eliminar el usuario." });
        }
        res.status(200).json({ mensaje: "Aprendiz eliminado correctamente." });
      },
    );
  });
});

app.get("/error", (req, res, next) => {
  next(new Error("Error provocado"));
});

app.get("/api/rutaprotegida", autenticacionMiddle, (req, res, next) => {
  res.json({ mensaje: "Ruta protegida" });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const usuario = {
    id: 111,
    perfil: "aprendiz",
    usernamebd: "jogm",
    passwordbd: "abc123",
  };
  if (username !== usuario.usernamebd || password !== usuario.passwordbd) {
    return res.status(400).json({ mensaje: "usuario o contraseña incorrectos" });
  }
  console.log(`Datos usuario json : ${username} - ${password}`);
  const token = jwtoken.sign(
    { id: usuario.id, perfil: usuario.perfil },
    process.env.JWT_SECRET,
    { expiresIn: "4h" },
  );
  res.json({ token });
});

app.use(manejoErrMiddleware);

//escucha el puerto donde despliega el servidor
app.listen(PORT, () => {
  console.log(`URL SERVIDOR: http://localhost:${PORT}`);
});