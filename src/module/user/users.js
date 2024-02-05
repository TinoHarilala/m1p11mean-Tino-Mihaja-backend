var express = require('express');
var router = express.Router();

// Ajoute ce middleware pour gérer le corps de la requête
router.use(express.json());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET users listing. */
router.get('/aaa', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
