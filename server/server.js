const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { typeDefs } = require('../models/definitions/typeDefs.js')
const { resolvers } = require('../controllers/resolvers.js')
const { UserModel } = require('../models/database/users.js')
const jwt = require('jsonwebtoken')

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await UserModel.getById({ id: decodedToken.id})
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})