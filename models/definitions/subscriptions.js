const { gql } = require('graphql-tag')

const typeSubscription = gql`
  type Subscription {
    personAdded: Person!
  }    
`

module.exports = { typeSubscription };
