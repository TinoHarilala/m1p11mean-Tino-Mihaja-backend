var express = require('express');
const RendezVousController = require('./RendezVousController');
var router = express.Router();

const rendezVousController = new RendezVousController();

/* Prise RendezVous. */
router.post('/client.rendezVous', rendezVousController.priseRendezVous);


module.exports = router;