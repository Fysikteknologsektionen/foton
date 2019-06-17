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

// Returns JSON containing name, authors, thumbnail image, order and list of images contained in album in ascending order
app.get('/album/:id', [
    param('id').isString().escape()
], (req, res, next) => {
    var response = {};
    // Construct promises for faster async filesystem interaction
    var promises = [
        new Promise((resolve, reject) => {
            fs.readFile(filespath + req.params.id + '/meta.json', (err, data) => {
                if (err) reject(err);
                else return resolve(metadata = JSON.parse(data));
            });
        }),
        new Promise((resolve, reject) => {
            fs.readdir(filespath + req.params.id, { withFileTypes: true }, (err, files) => {
                if (err) reject(err);
                else {
                    var images = files.filter((item) => {
                        return extensions.includes(path.extname(item.name));
                    });
                    return resolve(images.map((image) => image.name));
                }
            });
        })
    ]
    Promise.all(promises)
    .then((data) => {
        var response = data[0];
        response.images = data[1];
        return res.json(response);
    })
    .catch((err) => {
        next(err);
    });
});

// Returns JSON containing image path and thumbnail path
app.get('/image/:id', (req, res) => {
    
});

app.listen(3000, () => {
  console.log('Express listening on port 3000');
});
