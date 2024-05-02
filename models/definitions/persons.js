const { gql } = require('graphql-tag')
const { typeAddress } = require('./address.js')

const typePerson = gql`
  ${typeAddress}

  type Person {
    name: String!
    phone: String
    address: Address!
    friendOf: [User!]
    id: ID!
  }

  enum YesNo {
    YES
    NO
  }

  type Query {
    personsCount: Int!
    allPersons: [Person!]!
    getPersonsWithPhone(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(
      name: String!
      phone: String!
    ): Person
    addAsFriend(
      name: String!
    ): User
  }
`

module.exports = { typePerson };
