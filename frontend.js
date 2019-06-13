var path = require('path');
var express = require('express');
var router = express.Router();

var frontenddir = path.join(__dirname, 'frontend');
router.use(express.static(frontenddir));

module.exports = router;
