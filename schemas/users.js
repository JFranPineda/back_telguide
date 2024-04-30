const mongoose = require('mongoose')
const { client } = require('../models/database/connect.js');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required.'],
    minlength: [3, 'Username length should be greater than 3']
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person'
    }
  ],
  favoriteGenre: {
    type: String,
    minlength: [5, 'Genre length should be greater than 5']
  }
}, { collection: 'users' });

module.exports = client.model('User', userSchema)