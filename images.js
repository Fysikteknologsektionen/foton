var path = require('path');
var express = require('express');
var router = express.Router();

var imgdir = path.join(__dirname, 'images');
router.use(express.static(imgdir));

module.exports = router;
