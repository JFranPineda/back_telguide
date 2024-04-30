const mongoose = require('mongoose');
require('dotenv').config()

const mongoUser = {
  user: process.env.MONGODB_USER,
  password: process.env.MONGODB_PASSWORD,
  dbname: 'books_store'
}
const uri = `mongodb+srv://${mongoUser.user}:${mongoUser.password}@ethseccluster.9zokwca.mongodb.net/${mongoUser.dbname}`

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true
  }
}).then(() => {
  console.log('connected to MongoDB')
}).catch((error) => {
  console.log('error connection to MongoDB:', error.message)
});

const client = mongoose.connection;

module.exports = { client };