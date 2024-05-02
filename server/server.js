const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')

const { ApolloServer } = require('@apollo/server')
const { typeDefs } = require('../models/definitions/typeDefs.js')
const { resolvers } = require('../controllers/resolvers.js')
const { UserModel } = require('../models/database/users.js')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')

const express = require('express')
const cors = require('cors')
const http = require('http')
const jwt = require('jsonwebtoken')

const app = express()
const PORT = 4000
const httpServer = http.createServer(app)

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/',
})

const schema = makeExecutableSchema({ typeDefs, resolvers })

const serverCleanup = useServer({ schema }, wsServer)

const server = new ApolloServer({
  schema: schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ]
})

const context = async ({ req, res }) => {
  const auth = req ? req.headers.authorization : null
  if (auth && auth.startsWith('Bearer ')) {
    const decodedToken = jwt.verify(
      auth.substring(7), process.env.JWT_SECRET
    )
    const currentUser = await UserModel.getById({ id: decodedToken.id})
    return { currentUser }
  }
}

const start = async () => {
  await server.start()
  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: context,
    }),
  )
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}
start()