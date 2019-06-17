const fs = require('fs');
const path = require('path');
const { param } = require('express-validator/check');

const filespath = path.join(__dirname, '..', 'files');

const extensions = ['.jpg', '.jpeg', '.jpe', '.jif', '.jfif', '.jfi', '.gif', '.png',
'.bmp', '.dib'];

exports.validate = (() => {
    return param('id').isString().escape();
});

// Returns JSON containing list of all albums in ascending order
exports.albumList = ((req, res, next) => {
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
exports.albumDetail = ((req, res, next) => {
    var response = {};
    // Uses promises for faster async filesystem interaction
    var promises = [
        new Promise((resolve, reject) => {
            fs.readFile(path.join(filespath, req.params.id, 'meta.json'), (err, data) => {
                if (err) reject(err);
                else return resolve(metadata = JSON.parse(data));
            });
        }),
        new Promise((resolve, reject) => {
            fs.readdir(path.join(filespath, req.params.id), { withFileTypes: true }, (err, files) => {
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

exports.imageDetail = ((req, res) => {
    
    
});

