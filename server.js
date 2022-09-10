'use strict';

require('dotenv').config();
const { response } = require('express');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3010;

const mongoURL = process.env.MONGO
// mongoose configurations
mongoose.connect(`${mongoURL}`, { useNewUrlParser: true, useUnifiedTopology: true }); // 1 - connect mongoose with DB

const bookSchema = new mongoose.Schema({ //define the schema
  title: String,
  description: String,
  state: String
});

const BookModel = mongoose.model('Book', bookSchema); //compile the schema into a model

//Routes
app.get('/', homeHandler);
app.get('/test', testHandler);
app.get('/getBooks', getBooksHandler);
app.get('*', defualtHandler);
app.post('/addBooks', addBooksHandler);
app.delete('/deleteBooks/:id', deleteBookHandler);
app.put('/updateBooks/:id', updateBookHandler);


// http://localhost:3010/
function homeHandler(req, res) {
  res.send("Hi from the home route");
}

// http://localhost:3010/test
function testHandler(req, res) {
  res.status(200).send("You are requesting the test route");
}

// http://localhost:3010/*
function defualtHandler(req, res) {
  res.status(404).send("Page not found :(");
}

// http://localhost:3010/getBooks
function getBooksHandler(req, res) {
  const name = req.query.name

  BookModel.find({name:name}, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(result);
      res.send(result);
    }
  })
}

// http://localhost:3010/addBooks
async function addBooksHandler(req, res) {
  const { title, description, status } = req.body;

  await BookModel.create({
    title: title,
    description: description,
    status: status
  });
}

// http://localhost:3010/deleteBooks/:id
function deleteBookHandler(req, res) {
  const bookID = req.params.id;
  const name = req.query.name
  BookModel.findByIdAndDelete(bookID, (err, result) => {
    book.find({name:name},(err,result)=>{ 
      if(err)
      {
          console.log(err);
      }
      else
      {
          // console.log(result);
          res.send(result);
      }
  })
    
  })
}

// http://localhost:3010/updateBooks/:id
function updateBookHandler(req, res) {
  const id = req.params.id;
  const { title, description, status } = req.body;

  BookModel.findByIdAndUpdate(id, { title, description, status }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  })

}

//initial data
async function seedData() {
  const firstBook = new BookModel({
    title: "Da Vinci Code",
    description: "Symbologist Robert Langdon travels from Paris to London to unravel a bizarre murder. Accompanied by a cryptographer, he soon comes across a religious enigma protected by an age-old secret society.",
    state: "available"
  })

  const secondBook = new BookModel({
    title: "Harry Potter and the Deathly Hallows",
    description: "After Voldemort takes over the Ministry of Magic, Harry, Ron and Hermione are forced into hiding. They try to decipher the clues left to them by Dumbledore to find and destroy Voldemort's Horcruxes.",
    state: "available"
  })

  const thirdBook = new BookModel({
    title: "Life of Pi",
    description: "Molitor Pi Patel, a Tamil boy from Pondicherry, explores issues of spirituality and practicality from an early age. He survives 227 days after a shipwreck while stranded on a boat in the Pacific Ocean with a Bengal tiger named Richard Parker.",
    state: "sold-out"
  })

  await firstBook.save();
  await secondBook.save();
  await thirdBook.save();


}
//seedData();

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
})