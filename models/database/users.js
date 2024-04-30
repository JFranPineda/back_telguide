const { ObjectId } = require('mongodb')
const User = require('../../schemas/users.js')

class UserModel {
  static async create ({ input }) {
    const user = User.findOne({ username: input.username })
    if(user._id) {
      return null
    }
    const newUser = new User(input)
    await newUser.save()
    return {
      id: newUser._id,
      ...input
    }
  }

  static async getById ({ id }) {
    if (ObjectId.isValid(id)) {
      const user = await User.findById(id).populate('friends')
      return user
    }
    return {}
  }

  static async getLogin ({ username }) {
    const user = await User.findOne({ username: username })
    if(!user) {
      return null
    }
    return user
  }
}

module.exports = { UserModel };