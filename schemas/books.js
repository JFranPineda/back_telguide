const mongoose = require('mongoose')
const { client } = require('../models/database/connect.js');
const uniqueValidator = require('mongoose-unique-validator')

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required.'],
    unique: true,
    minlength: [5, 'Book title length should be greater than 5']
  },
  published: {
    type: Number,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  genres: [
    { type: String}
  ]
}, { collection: 'books' })

bookSchema.plugin(uniqueValidator)

module.exports = client.model('Book', bookSchema)