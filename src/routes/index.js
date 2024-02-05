var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('../module/client/clientRoutes');
var clientRouter = require('../module/user/users');

var app = express();
// const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');

const connectionString = "mongodb+srv://salon:beaute@cluster0.bjohxyg.mongodb.net/?retryWrites=true&w=majority"

// MongoClient.connect(connectionString)
//   .then(client => {
//     console.log('Connected to Database')

//   })
//   .catch(console.error)

// Mongo DB conncetion

mongoose.connect(connectionString, {dbName: 'salondebeaute'})
  .then(() => console.log('Connected to Database'))
  .catch(err => console.log(err));

app.use(express.json());
app.use(clientRouter);
app.use(usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
