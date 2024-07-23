const express = require('express');
const mongoose = require('mongoose');
const imagenRoutes = require('./routes/imagen'); // Rutas para imágenes

// Crear la aplicación Express
const app = express();

// Configurar middleware
app.use(express.json()); // Para procesar JSON en el cuerpo de las solicitudes

// Servir archivos estáticos (imágenes) desde la carpeta uploads
app.use('/uploads', express.static('uploads'));

// Configurar rutas
app.use('/api/images', imagenRoutes); // Rutas para imágenes

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de imágenes');
});

mongoose
.connect('mongodb+srv://junitomor:Nico289506@cluster0.yyjhciu.mongodb.net/Cluster0?retryWrites=true&w=majority')
.then(() => console.log("Connected to MongoDB Atlas"))
.catch((error) => console.error(error));

app.listen(1000);