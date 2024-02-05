var express = require('express');
const ClientController = require('./ClientController');
var router = express.Router();

const clientController = new ClientController();

/* GET home page. */
router.post('/login', clientController.login);

/* GET users listing. */
router.post('/registration', clientController.registrate);

module.exports = router;
