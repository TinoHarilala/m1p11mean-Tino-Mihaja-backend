var express = require('express');
const PreferenceController = require('./PreferenceController');
var router = express.Router();

const preferenceController = new PreferenceController();

/* Create preference. */
router.post('/create.preference', preferenceController.create);

/* Get preference. */
router.get('/get.preference', preferenceController.get);

router.get('/preference/:id', preferenceController.findById);

router.post('/update.preference', preferenceController.update);

router.get('/delete.preference/:id', preferenceController.delete);

module.exports = router;