var express = require('express');
const OffreSpecialController = require('./OffreSpecialController');
var router = express.Router();

const offreSpecialController = new OffreSpecialController();

/* Create offreSpecial. */
router.post('/create.offreSpecial', offreSpecialController.create);

/* Get offreSpecial. */
router.get('/get.offreSpecial', offreSpecialController.get);

/* Get offreSpecial valide. */
router.get('/valide.offreSpecial/:date/:idService', offreSpecialController.getValide);

router.get('/offreSpecial/:id', offreSpecialController.findById);

router.post('/update.offreSpecial', offreSpecialController.update);

router.get('/delete.offreSpecial/:id', offreSpecialController.delete);

module.exports = router;