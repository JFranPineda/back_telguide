const { GraphQLError } = require('graphql')
const { PersonModel } = require('../models/database/persons.js')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolversPerson = {
  Query: {
    personsCount: async () => await PersonModel.getCount(),
    allPersons: async (root, args) => {
      const { phone = null } = args
      const persons = await PersonModel.getAll({ phone })
      return persons
    },
    getPersonsWithPhone: async (root, args) => {
      const { phone = null } = args
      return await PersonModel.getAll({ phone })
    },
    findPerson: async (root, args) => {
      const name = args.name
      return await PersonModel.getByName({ name })
    }
  },
  Person: {
    address: ({ street, city }) => {
      return {
        street,
        city,
      }
    }
  },
  Mutation: {
    addPerson: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Not Authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      const person = await PersonModel.create({ input: args })
      if (!person) {
        throw new GraphQLError('Saving person failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
      currentUser.friends = [...currentUser.friends, person._id]
      await currentUser.save()
      const personObj = { ...person, id: person._id }
      pubsub.publish('PERSON_ADDED', { personAdded: personObj })
      return personObj
    },
    editNumber: async (root, args) => {
      const updatedPerson = await PersonModel.update({ name: args.name, input: args})
      if (!updatedPerson) {
        throw new GraphQLError('Saving number failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
      return updatedPerson
    },
    addAsFriend: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Wrong Credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        }) 
      }
      const nonFriendAlready = (person) =>
        !currentUser.friends.map(f => f._id.toString()).includes(person._id.toString())
  
      const person = await PersonModel.getByName({ name: args.name })
      if ( nonFriendAlready(person) ) {
        currentUser.friends = [...currentUser.friends, person._id]
      }
      await currentUser.save()
      return currentUser
    },
  },
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterator('PERSON_ADDED')
    },
  },
}

module.exports = { resolversPerson }
