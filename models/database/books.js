const { ObjectId } = require('mongodb')
const Book = require('../../schemas/books.js')
const Author = require('../../schemas/authors.js')

class BookModel {
  static async getAll ({ author }) {
    if (author && ObjectId.isValid(author)) {
      const objectId = new ObjectId(author)
      const booksWithAuthor = await Book.find({ author: objectId }).populate('author')
      return booksWithAuthor
    }
    const allBooks = await Book.find({}).populate('author')
    return allBooks
  }

  static async getByTitle ({ title }) {
    const bookWithTitle = await Book.findOne({ title }).populate('author')
    return bookWithTitle
  }

  static async getCount () {
    const quantity = await Book.countDocuments()
    return quantity
  }

  static async getAdvancedSearch ({ author, genre }) {
    if (!genre && !author) {
      return [];
    }

    let query = {};
    if (author) {
      const authorObj = await Author.findOne({ name: author });
      if (authorObj) {
        query.author = authorObj._id;
      }
    }
    if (genre) {
      query.genres = genre;
    }
    const books = await Book.find(query).populate('author')
    return books
  }

  static async create ({ input }) {
    const book = await Book.findOne({ name: input.title })
    if(book && book._id) {
      return null
    }
    const author = await Author.findOne({ name: input.author })
    const bookData = {
      ...input,
      author: author && author._id,
      published: +input.published
    }
    if (!author) {
      const newAuthor = new Author({ name: input.author })
      bookData.author = newAuthor._id
      newAuthor.bookCount = 1
      await newAuthor.save()
    }
    if (author) {
      const currentBookCount = author?.bookCount || 0
      await Author.updateOne({ _id: author._id }, { $set: { bookCount: currentBookCount + 1 } })
    }
    const newBook = new Book(bookData)
    newBook.populate('author')
    await newBook.save()
    return newBook
  }
}

module.exports = { BookModel };