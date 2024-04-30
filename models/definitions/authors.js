const { gql } = require('graphql-tag')

const typeAuthor = gql`
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Query {
    authorsCount: Int!
    allAuthors: [Author!]!
    findAuthor(name: String!): Author
  }

  type Mutation {
    editAuthor(
      name: String
      setBornTo: Int
    ): Author
  }
`;

module.exports = { typeAuthor };
