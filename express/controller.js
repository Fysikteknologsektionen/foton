const fs = require('fs');
const path = require('path');
const { param } = require('express-validator/check');
const { promisify } = require('util')

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

const filespath = path.join(__dirname, '..', 'files');

const extensions = ['.jpg', '.jpeg', '.jpe', '.jif', '.jfif', '.jfi', '.gif', '.png',
'.bmp', '.dib'];

// Validates album IDs
exports.validate = (() => {
    return param('id').isString().escape();
});

// Returns JSON containing list of meta info for all albums
exports.albumList = (async (req, res, next) => {
    var files = [];
    try {
        files = await readdir(filespath, { withFileTypes: true });
    } catch (err) {
        console.error('Failed to load albums');
        return res.status(500);
    }
        
    const directories = files.filter(file => file.isDirectory());
    const albums = directories.map(directory => directory.name);

    if (albums.length == 0) return res.status(204).send();

    // Returns array of promises
    const promises = albums.map(async album => {
        try {
            const meta = await readFile(path.join(filespath, album, 'meta.json'));
            const json = JSON.parse(meta);
            
            // Check if all required meta tags exist in file
            const props = ['name', 'description', 'author', 'date', 'thumbnail', 'order'];
            const keys = Object.keys(json);
            if (!props.every(prop => keys.includes(prop))) {
                throw new Error(`keys missing from meta.json in '${album}'`);
            }

            json.id = album;
            return json;
        } catch (err) {
            // Catch before bubbling to Promise.all, which has all-or-fail behaviour resulting in no albums if one cannot be loaded
            console.error(err);
            return;
        }
    });

    // Resolves all promises simultaneously
    Promise.all(promises).then(response => {
        return res.json(response);
    });
});

// Returns JSON containing list of images contained in album
exports.albumDetail = (async (req, res, next) => {
    const album = req.params.id;
    var files = [];
    try {
        files = await readdir(path.join(filespath, album), { withFileTypes: true });
    } catch (err) {
        console.error(`Failed to load album ${album}`);
        return res.status(500);
    }

    const imageFiles = files.filter(file => extensions.includes(path.extname(file.name)));
    var response = {};
    response.images = imageFiles.map(image => image.name);

    return res.json(response);
});
