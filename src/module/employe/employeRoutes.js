var express = require('express');
const EmployeController = require('./EmployeController');
var router = express.Router();

const employeController = new EmployeController();

/* POST Login Employe. */
router.post('/login.employe', employeController.login);

/* POST Inscription Employe. */
router.post('/registration.employe', employeController.registrate);

router.get('/get.employe', employeController.getEmployes);


module.exports = router;
