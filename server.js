const express = require('express');
const path = require('path');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const router = require('./express/routes.js');

const port = 3002;
const app = express();

app.use(bodyParser.json());
app.use(expressValidator());

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'files')));

app.use('/', router);

// Should be __dirname/build/index.html during production
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.listen(port, () => {
  console.log('Express listening on port 3002');
});