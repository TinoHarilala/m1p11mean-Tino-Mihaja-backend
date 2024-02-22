var express = require('express');
const DepenseController = require('./DepenseController');
var router = express.Router();

const depenseController = new DepenseController();

/* Create depense. */
router.post('/create.depense', depenseController.create);

/* Get depense. */
router.get('/get.depense', depenseController.get);

router.get('/depense/:id', depenseController.findById);

router.post('/update.depense', depenseController.update);

router.get('/delete.depense/:id', depenseController.delete);

module.exports = router;