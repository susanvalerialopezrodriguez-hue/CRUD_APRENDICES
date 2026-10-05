//creamos las funciones para utilizar en el router
const jwtoken = require("jsonwebtoken")
const iniciarSesion = async (req, res) => {

    const { usuario, clave } = req.body
    //simular bd
    const usuariobd = {
        "usuario": "jhonny",
        "clave": "abc123"
    }

    //validar datos del usuario
    if (usuario !== usuariobd.usuario || clave !== usuariobd.clave ) {
        res.json({ mensaje: "Usuario y/o clave incorrectos." })
    }
    //crear token
    const token = jwtoken.sign(
        //pasamos datos del usuario
        { user: usuario },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )
    res.json({ token })
}


// try {

// } catch (error) {

// }
 
// 

module.exports = iniciarSesion;