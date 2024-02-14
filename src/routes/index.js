var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var clientRouter = require('../module/client/clientRoutes');
var employeRouter = require('../module/employe/employeRoutes');
var serviceRouter = require('../module/service/serviceRoutes');
var preferenceRouter = require('../module/preference/preferenceRoutes')

var app = express();
// const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');

const connectionString = process.env.DB_URL;

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
app.use(employeRouter);
app.use(serviceRouter);
app.use(preferenceRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
