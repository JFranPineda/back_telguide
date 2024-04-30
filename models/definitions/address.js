const { gql } = require('graphql-tag')

const typeAddress = gql`
  type Address {
    street: String!
    city: String! 
  }
`;

module.exports = { typeAddress };
