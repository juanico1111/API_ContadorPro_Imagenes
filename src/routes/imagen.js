const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Imagen = require('../models/imagen');

const router = express.Router();

// Configurar multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'), false);
    }
  }
});

// Crear una nueva imagen
router.post('/', upload.single('image'), (req, res) => {
  const { name, weight, url, description } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: 'No se adjuntó ninguna imagen' });
  }

  const newImage = new Imagen({
    name,
    weight,
    url,
    description,
    filePath: req.file.path
  });

  newImage.save()
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ message: error.message }));
});

// Obtener todas las imágenes
router.get('/', (req, res) => {
  Imagen.find()
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ message: error.message }));
});

// Obtener una imagen por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Imagen.findById(id)
    .then((data) => {
      if (!data) {
        return res.status(404).json({ message: 'Imagen no encontrada' });
      }
      res.sendFile(path.resolve(data.filePath));
    })
    .catch((error) => res.status(500).json({ message: error.message }));
});

// Eliminar una imagen
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Imagen.findByIdAndDelete(id)
    .then((data) => {
      if (data) {
        fs.unlink(data.filePath, (err) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
          res.json(data);
        });
      } else {
        res.status(404).json({ message: 'Imagen no encontrada' });
      }
    })
    .catch((error) => res.status(500).json({ message: error.message }));
});

// Actualizar una imagen
router.put('/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, weight, url, description } = req.body;
  const updateData = { name, weight, url, description };

  if (req.file) {
    updateData.filePath = req.file.path;
  }

  Imagen.findByIdAndUpdate(id, updateData, { new: true })
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ message: error.message }));
});

module.exports = router;
