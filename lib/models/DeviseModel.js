const mongoose = require('mongoose');

const DeviseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: 'Entrer le montant'
  },
  currency: {
    type: String,
    required: 'Entrer la devise'
  },
  created_date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.models.Devise || mongoose.model('Devise', DeviseSchema);