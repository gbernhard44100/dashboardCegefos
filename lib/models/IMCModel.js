const mongoose = require('mongoose');

const IMCSchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: 'Entrer le poids en kg'
  },
  height: {
    type: Number,
    required: 'Entrer la taille en cm'
  },
  created_date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.models.IMC || mongoose.model('IMC', IMCSchema);