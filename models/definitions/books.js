const { gql } = require('graphql-tag')

const typeBook = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Query {
    booksCount: Int!
    allBooks: [Book!]!
    findBook(title: String!): Book
    findBooksByAuthor(author: ID!): [Book!]!
    advancedSearch(author: String, genre: String): [Book!]
    getRecommendations: [Book!]
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
  }
`;

module.exports = { typeBook };
