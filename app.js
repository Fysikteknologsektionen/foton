const express = require('express');
const fs = require('fs');
const path = require('path');
const { param, check, validationResult } = require('express-validator/check');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());

const filespath = __dirname + '/files/';

const extensions = ['.jpg', '.jpeg', '.jpe', '.jif', '.jfif', '.jfi', '.gif', '.png',
'.bmp', '.dib'];


// Returns JSON containing list of all albums in ascending order
app.get('/album', (req, res, next) => {
    fs.readdir(filespath, { withFileTypes: true }, (err, files) => {
        if (err) next(err);
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
], (req, res, next) => {
    var response = {};
    fs.readdir(filespath + req.params.id, { withFileTypes: true }, (err, files) => {
        if (err) next(err);
        else {
            var images = files.filter((item) => {
                return extensions.includes(path.extname(item.name));
            });
            response.images = images;
        }
    });
    fs.readFile(filespath + req.params.id + '/meta.json', (err, data) => {
        if (err) next(err);
        else {
            var metadata = JSON.parse(data);
            console.log(metadata);
        }
    });
    return res.json(response);
});

// Returns JSON containing image path and thumbnail path
app.get('/image/:id', (req, res) => {
    
});

app.listen(3000, () => {
  console.log('Express listening on port 3000');
});
