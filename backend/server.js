const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./db/config');

//Crear el sevidor de express
const app = express();

//Base de datos
dbConnection();

//CORS
app.use(cors());

//Directorio publico
app.use(express.static('public'));

//Lectura y parseo del body
app.use(express.json());

//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/schedule', require('./routes/schedule'));
app.use('/api/studygroup', require('./routes/studygroup'));



//Escuchar peticiones
app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${4000}`);
});