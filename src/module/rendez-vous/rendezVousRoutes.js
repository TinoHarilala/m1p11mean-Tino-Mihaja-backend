var express = require('express');
const RendezVousController = require('./RendezVousController');
var router = express.Router();

const rendezVousController = new RendezVousController();

/* CLIENT. */
router.post('/client.rendezVous', rendezVousController.priseRendezVous);
router.get('/indisponibilite', rendezVousController.indisponibilite);
router.get('/historique/:id', rendezVousController.historique);

/* EMPLOYE. */
router.get('/employe.rendezVous/:id', rendezVousController.rendezVousEmp);


module.exports = router;