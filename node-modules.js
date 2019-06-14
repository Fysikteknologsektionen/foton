var path = require('path');
var express = require('express');
var router = express.Router();

var moduledir = path.join(__dirname, 'node_modules');
router.use(express.static(moduledir));

module.exports = router;