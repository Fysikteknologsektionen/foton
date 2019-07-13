const express = require('express');
const controller = require('./controller.js');

const router = express.Router();

router.get('/', controller.albumList);
router.get('/:id', controller.validate, controller.albumDetail);
module.exports = router;