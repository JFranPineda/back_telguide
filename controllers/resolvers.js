const { resolversPerson } = require('./persons.js')
const { resolversUser } = require('./users.js')
const { resolversAuthor } = require('./authors.js')
const { resolversBook } = require('./books.js')
const { merge } = require('lodash');

const resolvers = merge(resolversUser, resolversPerson, resolversBook, resolversAuthor)

module.exports = { resolvers }