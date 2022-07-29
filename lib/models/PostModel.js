const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Entrer le titre du post'
  },
  content: {
    type: String,
    required: 'Entrer le contenu du post'
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  loveIts: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.models.Post || mongoose.model('Post', PostSchema);