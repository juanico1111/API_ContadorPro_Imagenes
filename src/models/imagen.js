const mongoose = require('mongoose');

const imagenSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  filePath: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Imagen', imagenSchema);
