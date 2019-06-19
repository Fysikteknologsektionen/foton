const fs = require('fs');
const path = require('path');
const { param } = require('express-validator/check');
const { promisify } = require('util')

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

const filespath = path.join(__dirname, '..', 'files');

const extensions = ['.jpg', '.jpeg', '.jpe', '.jif', '.jfif', '.jfi', '.gif', '.png',
'.bmp', '.dib'];

exports.validate = (() => {
    return param('id').isString().escape();
});

// Returns JSON containing list of meta info for all albums
exports.albumList = (async (req, res, next) => {
    var response = [];
    var files = [];
    try {
        files = await readdir(filespath, { withFileTypes: true });
    } catch (err) {
        console.error('Failed to load albums');
        return res.status(500);
    }
        
    const directories = files.filter((file) => file.isDirectory());
    const albums = directories.map((directory) => directory.name);

    if (albums.length == 0) return res.status(204).send();

    const promises = albums.map(async (album) => {
        try {
            const meta = await readFile(path.join(filespath, album, 'meta.json'));
            const json = JSON.parse(meta);
            
            const props = ['name', 'description', 'author', 'date', 'thumbnail', 'order'];
            const keys = Object.keys(json);
            if (!props.every(prop => keys.includes(prop))) {
                throw new Error(`keys missing from meta.json in '${album}'`);
            }

            json.id = album;
            return json;
        } catch (err) {
            console.error(err);
            return;
        }
    });

    Promise.all(promises).then((response) => {
        return res.json(response);
    });
});

// Returns JSON containing list of images contained in album
exports.albumDetail = ((req, res, next) => {
    var response = {};
    // Uses promises for faster async filesystem interaction
        new Promise((resolve, reject) => {
            fs.readdir(path.join(filespath, req.params.id), { withFileTypes: true }, (err, files) => {
                if (err) reject(err);
                else {
                    var images = files.filter((item) => extensions.includes(path.extname(item.name)));
                    return resolve(images.map((image) => image.name));
                }
            });
        });
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

