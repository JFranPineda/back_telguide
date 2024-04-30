const { gql } = require('graphql-tag')

const typeUser = gql`
  type User {
    username: String!
    friends: [Person!]!
    favoriteGenre: String
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

module.exports = { typeUser };
