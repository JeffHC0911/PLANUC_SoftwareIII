const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./db/config');

// Crear la aplicación de Express
const app = express();

// Conexión a la base de datos
dbConnection();

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/schedule', require('./routes/schedule'));
app.use('/api/studygroup', require('./routes/studygroup'));

// Exportar la app para usarla en pruebas o en el servidor
module.exports = app;
