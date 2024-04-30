const mongoose = require('mongoose')
const { client } = require('../models/database/connect.js');
const uniqueValidator = require('mongoose-unique-validator')

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    unique: true,
    minlength: [4, "Author name length should be greater than 4"]
  },
  born: {
    type: Number,
  },
  bookCount: {
    type: Number,
  }
}, { collection: 'authors' })

authorSchema.plugin(uniqueValidator)

module.exports = client.model('Author', authorSchema)