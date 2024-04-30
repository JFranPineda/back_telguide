const { GraphQLError } = require('graphql')
const { AuthorModel } = require('../models/database/authors.js')

const resolversAuthor = {
  Query: {
    authorsCount: async () => await AuthorModel.getCount(),
    allAuthors: async (root, args) => {
      const authors = await AuthorModel.getAll()
      return authors
    },
    findAuthor: async (root, args) => {
      const author = await AuthorModel.getByName({ name: args.name })
      return author
    }
  },
  Mutation: {
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Not Authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      const { name } = args
      const updatedBook = await AuthorModel.update({ name, input: args})
      if (!updatedBook) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
      return updatedBook
    }
  }
}

module.exports = { resolversAuthor };
