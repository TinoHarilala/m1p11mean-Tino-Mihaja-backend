var express = require('express');
const NotificationController = require('./NotificationController');
var router = express.Router();

const notificationController = new NotificationController();

router.get('/update/:id', notificationController.update);
router.get('/get.notification/:idClient', notificationController.get);

module.exports = router;