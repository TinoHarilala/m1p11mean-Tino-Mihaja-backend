var express = require('express');
const CommissionEmpController = require('./commissionEmpController');
var router = express.Router();

const commissionEmpController = new CommissionEmpController();

/* Détails du commissionEmp. */
router.get('/suivi.commission/:employe', commissionEmpController.get);

module.exports = router;