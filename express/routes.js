const express = require('express');
const controller = require('./controller.js');

const router = express.Router();

router.get('/albums/', controller.albumList);
router.get('/albums/:id/', controller.validate(), controller.albumDetail);
module.exports = router;