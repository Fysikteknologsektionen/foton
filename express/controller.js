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
exports.validate = [
  param('id')
  .isString()
  .escape()
];

// Read file and parse JSON data
async function readMetaFile(albumId) {
  const meta = await readFile(path.join(filespath, albumId, 'meta.json'));
  return JSON.parse(meta);
}

// Check if json object contains all keys passed as params 
function checkMetaKeys(keys, json) {
  const fileKeys = Object.keys(json);
  if (!keys.every(key => fileKeys.includes(key))) {
    throw new Error(`Keys missing from meta.json in album '${json.name}'`);
  }
}

// Returns JSON containing list of all albums and album meta
exports.albumList = (async (req, res) => {
  var files = [];
  try {
    files = await readdir(filespath, { withFileTypes: true });
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
      
  const directories = files.filter(file => file.isDirectory());
  const albums = directories.map(directory => directory.name);

  if (albums.length == 0) return res.status(204).send();

  // Returns array of promises that are resolved async
  const promises = albums.map(async album => {
    try {
      var json = await readMetaFile(album);
      checkMetaKeys(['name', 'date', 'thumbnail', 'order'], json);
      json.id = album;
      return json;
    } catch (err) {
      // Catch here to ensure rest of albums are loaded if one fails
      console.error(err);
      return;
    }
  });

  Promise.all(promises).then(json => {
    const response = json.map(album => ({
      id: album.id,
      name: album.name,
      date: album.date,
      thumbnail: album.thumbnail,
      order: album.order
    }));
    return res.json(response);
  });
});

// Returns JSON containing album meta and list of images
exports.albumDetail = (async (req, res) => {
  const album = req.params.id;
  var files = [];
  var meta = {};
  try {
      files = await readdir(path.join(filespath, album), { withFileTypes: true });
  } catch (err) {
      console.error(err);
      return res.status(500).send();
  }
  try {
    const json = await readMetaFile(album);
    checkMetaKeys(['name', 'description', 'author', 'date'], json);
    meta = json;
    meta.id = album;
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
  
  const imageFiles = files.filter(file => extensions.includes(path.extname(file.name)));
  var response = meta;
  response.images = imageFiles.map(image => image.name);
  return res.json(response);
});

