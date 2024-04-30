const { GraphQLError } = require('graphql')
const { UserModel } = require('../models/database/users.js')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const resolversUser = {
  Query: {
    me: async (root, args, { currentUser }) => {
      const user = await UserModel.getById({ id: currentUser._id})
      return user
    }
  },
  Mutation: {
    createUser: async (root, args) => {
      const user = await UserModel.create({ input: args })
      if (!user) {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username
          }
        })
      }
      return user
    },
    login: async (root, args) => {
      const user = await UserModel.getLogin({ username: args.username })
      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('Wrong Credentials...', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username
          }
        })        
      }
      const userForToken = {
        username: user.username,
        id: user._id
      }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
}

module.exports = { resolversUser };
