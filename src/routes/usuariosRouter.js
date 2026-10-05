const {Router} = require('express');

const enrutador = Router();

enrutador.get('/', (req, res) => {
    res.send({message: "listado usuarios"})
})

module.exports = enrutador