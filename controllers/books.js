const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')
const { BookModel } = require('../models/database/books.js')

const resolversBook = {
  Query: {
    booksCount: async () => await BookModel.getCount(),
    allBooks: async (root, args) => {
      const books = await BookModel.getAll({ author: null})
      return books
    },
    findBook: async (root, args) => {
      const { title = null } = args
      const books = await BookModel.getByTitle({ title })
      return books
    },
    findBooksByAuthor: async (root, args) => {
      const { author = null } = args
      const books = await BookModel.getAll({ author })
      return books
    },
    advancedSearch: async (root, args) => {
      const { author = null, genre = null } = args
      const allBooks = genre === 'all-books' ? await BookModel.getAll({ author: null}) : []
      const books = genre != 'all-books' ? await BookModel.getAdvancedSearch({ author, genre }) : []
      return genre === 'all-books' ? allBooks : books
    },
    getRecommendations: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Not Authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      const { author = null, favoriteGenre = null } = currentUser
      const books = await BookModel.getAdvancedSearch({ author, genre: favoriteGenre })
      return books
    }
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Not Authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      const book = await BookModel.create({ input: args })
      if (!book) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title
          }
        })
      }
      return book
    }
  }
}

module.exports = { resolversBook };
