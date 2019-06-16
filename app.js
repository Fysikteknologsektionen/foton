const express = require('express');
var fs = require('fs');
const { check, validationResult } = require('express-validator/check');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());


// Returns JSON containing list of all albums in ascending order
app.get('/album', (req, res) => {
    fs.readdir(__dirname + '/files', { withFileTypes: true }, (err, files) => {
        if (err) {
            next(err);
        }
        else {
            var directories = files.filter((item) => {
                return item.isDirectory();
            });
            if (directories.length == 0) return res.status(204).send();
            else return res.json(directories);
        }
    });
});

// Returns JSON containing album id, name, cover image, photographer(s) and list of images contained in album in ascending order
app.get('/album/:id', [
    param('id').isString().escape()
], (req, res) => {
    
});

// Returns JSON containing image path and thumbnail path
app.get('/image/:id', (req, res) => {
    
});

app.listen(3000, () => {
  console.log('Express listening on port 3000');
});
