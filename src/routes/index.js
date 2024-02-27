var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
require('../module/mail/emailScheduler');

var clientRouter = require('../module/client/clientRoutes');
var employeRouter = require('../module/employe/employeRoutes');
var serviceRouter = require('../module/service/serviceRoutes');
var preferenceRouter = require('../module/preference/preferenceRoutes');
var rendezVousRouter = require('../module/rendez-vous/rendezVousRoutes');
var offreSpesialRouter = require('../module/offre/offreSpecialRoutes');
var depenseRouter = require('../module/depense/depenseRoutes');
var paiementRouter = require('../module/paiement/paiementRoutes');
var commissionEmpRouter = require('../module/commissionEmp/commissionEmpRoutes');
var statistiqueEmpRouter = require('../module/statistiques/statistiqueRoutes');
var notificationRouter = require('../module/notification/notificationRoutes');

var app = express();

const mongoose = require('mongoose');

const connectionString = process.env.DB_URL;

mongoose.connect(connectionString, {dbName: 'salondebeaute'})
  .then(() => console.log('Connected to Database'))
  .catch(err => console.log(err));

app.use(express.json());
app.use(clientRouter);
app.use(employeRouter);
app.use(serviceRouter);
app.use(preferenceRouter);
app.use(rendezVousRouter);
app.use(offreSpesialRouter);
app.use(depenseRouter);
app.use(paiementRouter);
app.use(commissionEmpRouter);
app.use(statistiqueEmpRouter);
app.use(notificationRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
