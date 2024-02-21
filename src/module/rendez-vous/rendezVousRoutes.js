var express = require('express');
const RendezVousController = require('./RendezVousController');
var router = express.Router();

const rendezVousController = new RendezVousController();

/* Prise RendezVous. */
router.post('/client.rendezVous', rendezVousController.priseRendezVous);
router.get('/indisponibilite', rendezVousController.indisponibilite);


module.exports = router;