const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/planuc');


const nombreSchema = new mongoose.Schema({
  nombre: String,
});

const Nombre = mongoose.model('Nombre', nombreSchema);

app.post('/nombres', async (req, res) => {
  const { nombre } = req.body;
  const nuevoNombre = new Nombre({ nombre });
  await nuevoNombre.save();
  res.json(nuevoNombre);
});

app.get('/nombres', async (req, res) => {
  const nombres = await Nombre.find();
  res.json(nombres);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Servidor corriendo en el puerto 5000');
});
