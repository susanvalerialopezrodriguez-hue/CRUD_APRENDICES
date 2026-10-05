const jswtoken = require('jsonwebtoken');

const autenticacionMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ Error: "accesodenegado , no provee token" });
    }

    jswtoken.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(403).json({ Error: "token invalido" });
        }
        req.usuario = decoded;
        console.log("de autencicacion", req.usuario);
        next();
    });
};

module.exports = autenticacionMiddleware;
