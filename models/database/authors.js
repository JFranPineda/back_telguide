const Author = require('../../schemas/authors.js')
const Book = require('../../schemas/books.js')

class AuthorModel {
  static async getAll () {
    const authors = await Author.find({}, '_id')

    const authorBookCounts = new Map()
    const authorIds = authors.map(author => author._id)
    const bookCounts = await Book.aggregate([
      {
        $match: { author: { $in: authorIds } }
      },
      {
        $group: {
          _id: '$author',
          count: { $sum: 1 }
        }
      }
    ])

    bookCounts.forEach(result => {
      authorBookCounts.set(result._id.toString(), result.count)
    })

    const updatePromises = [];
    for (const [authorId, bookCount] of authorBookCounts.entries()) {
      updatePromises.push(Author.updateOne({ _id: authorId }, { $set: { bookCount } }));
    }
    
    await Promise.all(updatePromises);

    const allAuthors = await Author.find({})
    return allAuthors
  }

  static async getCount () {
    const quantity = await Author.countDocuments()
    return quantity
  }

  static async getByName ({ name }) {
    const author = await Author.findOne({ name })
    return author
  }

  static async update ({ name, input }) {
    const author = await Author.findOne({ name: name })
    if (!author) return null
    author.born = +input.setBornTo
    await author.save()
    return author
  }  
}

module.exports = { AuthorModel };