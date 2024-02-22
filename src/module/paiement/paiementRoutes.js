var express = require('express');
const PaiementController = require('./PaiementController');
var router = express.Router();

const paiementController = new PaiementController();

/* Détails du paiement. */
router.get('/paiement.rendezVous/:rendezVous/:client', paiementController.getDetails);

/* Paiement. */
router.post('/paiement.rendezVous', paiementController.payer);


module.exports = router;