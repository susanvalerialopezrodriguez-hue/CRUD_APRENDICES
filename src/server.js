const app = require('./app');

const PUERTO = process.env.PUERTO || process.env.PORT || 3111;

//inicia el servidor y despliega la api
app.listen(PUERTO, () => {
    console.log(`URL SERVIDOR: http://localhost:${PUERTO}`);
});