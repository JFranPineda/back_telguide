const Person = require('../../schemas/persons.js')

class PersonModel {
  static async getAll ({ phone }) {
    if (phone) {
      const person = await Person.find({ phone: { $exists: phone === 'YES'  }})
      return person
    }
    const persons = await Person.find({})
    return persons
  }

  static async getCount () {
    const quantity = await Person.countDocuments()
    return quantity
  }

  static async getByName ({ name }) {
    const person = await Person.findOne({ name }).lean()
    return { ...person, id: person._id }
  }

  static async create ({ input }) {
    const person = await Person.findOne({ name: input.name })
    if(person && person._id) {
      return null
    }
    const newPerson = new Person({ ...input })
    await newPerson.save()
    return newPerson.toObject()
  }

  static async update ({ name, input }) {
    const person = await Person.findOne({ name: name })
    if (!person) return null
    person.phone = input.phone
    await person.save()
    return person
  }  
}

module.exports = { PersonModel };