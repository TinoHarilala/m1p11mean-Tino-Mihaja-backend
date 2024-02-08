var express = require('express');
const ClientController = require('./ClientController');
var router = express.Router();

const clientController = new ClientController();

/* POST Login client. */
router.post('/login', clientController.login);

/* POST Inscription client. */
router.post('/registration', clientController.registrate);

module.exports = router;
