const manejadorErrores = (error, req, res, next) => {
    const codigoEstado = error.statusCode || 500;
    const mensaje = error.message || "Error inesperado";
    console.error(`Hubo un error : ${new Date().toISOString()} - ${codigoEstado} - ${mensaje}`);
    //verificar mas imformacion del error
    if (error.stack) {
        console.error(error.stack);
    }
    res.status(codigoEstado).json({ Error: mensaje });
};

module.exports = manejadorErrores;