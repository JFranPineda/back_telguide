const mongoose = require('mongoose');
const { client } = require('../models/database/connect.js');

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    minlength: 5
  },
  phone: {
    type: String,
    minlength: 5
  },
  street: {
    type: String,
    required: [true, 'Street is required.'],
    minlength: 5
  },
  city: {
    type: String,
    required: [true, 'City is required.'],
    minlength: 3
  },
}, { collection: 'persons' });

module.exports = client.model('Person', personSchema)
