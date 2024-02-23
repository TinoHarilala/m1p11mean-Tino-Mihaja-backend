var express = require('express');
const RendezVousController = require('./RendezVousController');
var router = express.Router();

const rendezVousController = new RendezVousController();

/* CLIENT. */
router.post('/client.rendezVous', rendezVousController.priseRendezVous);
router.post('/indisponibilite', rendezVousController.indisponibilite);
router.get('/historique/:idClient', rendezVousController.historique);

/* EMPLOYE. */
router.get('/employe.rendezVous/:idEmploye', rendezVousController.rendezVousEmp);
router.get('/done/:id', rendezVousController.done);
router.get('/suivi.task.done/:idEmploye', rendezVousController.suiviTacheEffectue);


module.exports = router;