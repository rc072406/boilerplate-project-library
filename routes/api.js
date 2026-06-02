/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');

// 1. Define the Book Schema and Model
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: { type: [String], default: [] }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    // GET all books
    .get(async function (req, res) {
      try {
        const books = await Book.find({});
        
        const formatBooks = books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        }));
        return res.json(formatBooks);
      } catch (err) {
        return res.json([]);
      }
    })
    
    // POST a new book
    .post(async function (req, res) {
      let title = req.body.title;
      
      if (!title) {
        return res.type('text').send('missing required field title');
      }

      try {
        const newBook = new Book({ title });
        const savedBook = await newBook.save();
        return res.json({
          _id: savedBook._id,
          title: savedBook.title
        });
      } catch (err) {
        return res.type('text').send('missing required field title');
      }
    })
    
    // DELETE all books
    .delete(async function(req, res) {
      try {
        await Book.deleteMany({});
        return res.type('text').send('complete delete successful');
      } catch (err) {
        return res.type('text').send('error deleting books');
      }
    });


  app.route('/api/books/:id')
    // GET a single book by id
    .get(async function (req, res) {
      let bookid = req.params.id;
      
      try {
        const book = await Book.findById(bookid);
        if (!book) {
          return res.type('text').send('no book exists');
        }
        return res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        });
      } catch (err) {
        // CastError handled here if id format is invalid
        return res.type('text').send('no book exists');
      }
    })
    
    // POST a comment to a book
    .post(async function(req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        return res.type('text').send('missing required field comment');
      }

      try {
        const book = await Book.findById(bookid);
        if (!book) {
          return res.type('text').send('no book exists');
        }
        
        book.comments.push(comment);
        const updatedBook = await book.save();
        
        return res.json({
          _id: updatedBook._id,
          title: updatedBook.title,
          comments: updatedBook.comments
        });
      } catch (err) {
        return res.type('text').send('no book exists');
      }
    })
    
    // DELETE a single book by id
    .delete(async function(req, res) {
      let bookid = req.params.id;
      
      try {
        const deletedBook = await Book.findByIdAndDelete(bookid);
        if (!deletedBook) {
          return res.type('text').send('no book exists');
        }
        return res.type('text').send('delete successful');
      } catch (err) {
        return res.type('text').send('no book exists');
      }
    });
  
};
