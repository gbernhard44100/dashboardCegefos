const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  lastname: {
    type: String,
    required: 'Entrer le nom'
  },
  firstname: {
    type: String,
    required: 'Entrer le prénom'
  },
  email: {
    type: String,
    unique : true,
    required: 'Entrer l\'adresse email'
  },
  password: {
    type: String,
    required: 'Entrer le mot de passe'
  },
  birthDate: {
    type: Date,
    required: 'Veuillez saisir la date de naissance'
  },
  address: {
    type: String,
    required: 'Entrer l\'adresse'
  },
  city: {
    type: String,
    required: 'Entrer le nom de la ville'
  },
  postalCode: {
    type: String,
    required: 'Entrer le code postal'
  },
  created_date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);