var express = require('express');
const StatistiqueController = require('./StatistiqueController');
var router = express.Router();

const statistiqueController = new StatistiqueController();

/* Create statistique. */
router.get('/statistique.temps', statistiqueController.tempsMoyenTravail);


module.exports = router;