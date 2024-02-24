var express = require('express');
const ServiceController = require('./ServiceController');
var router = express.Router();

const serviceController = new ServiceController();

/* Create Service. */
router.post('/create.service', serviceController.create);

/* Get Service. */
router.get('/get.service', serviceController.get);

router.get('/service/:id', serviceController.findById);

router.get('/service.employe/:idEmploye', serviceController.findByEmploye);

router.post('/update.service', serviceController.update);

router.get('/delete.service/:id', serviceController.delete);

module.exports = router;