const { gql } = require('graphql-tag')
const { typePerson } = require('./persons.js');
const { typeUser } = require('./users.js');
const { typeBook } = require('./books.js');
const { typeAuthor } = require('./authors.js');

const typeDefs = gql`
  ${typePerson}
  ${typeUser}
  ${typeBook}
  ${typeAuthor}
`

module.exports = { typeDefs };
