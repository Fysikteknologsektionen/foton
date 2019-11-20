# Foton Webgallery
Webgallery used by Photon at the Physics Division at the Chalmers University of Technology. Uses Node.js. Finished project at [foton.ftek.se](https://foton.ftek.se).

Developed by the Physics Student Divison's webgroup Spidera for the photo committee Photon.

## Requirements
* Node.js
* ImageMagick*

\* Optional, in order to automatically create thumbnails using ImageMagick the server must also be capable of running a bash script on a timer.

## Quick installation & setup 
```bash
$> git clone https://github.com/ECarlsson/foton
$> cd foton
$> npm install
$> npm run build
$> node server.js
```
The express server will be hosted on port 3002 by default. This behavior can be changed by supplying the environment variable "PORT".

To create thumbnails the server also needs to have the open-source tool ImageMagick installed and a timer to run `shellscripts/createThumbnails.sh` regularly. If thumbnails are not found it will fall back to the full-sized image. Note: the shell script must be run with the working directory set to the scripts directory for it to function properly.

## Creating albums and supplying meta information
Albums are represented by directories under `files`. Each albums require a `meta.json`file that supplies the following keys:
* name - Pretty album name
* description - Brief album description
* author - Author(s) of the images
* date - Date of the album
* thumbnail - The filename of the image contained in the album to be used as album thumbnail

The album will also have a key given as the name of the album directory.

Albums are sorted by date. Images in albums are sorted alphabetically by their name.

## API
 A list of all albums and album details can be fetched as JSON via the API. The available parameters are:

| Method | File           | Description                                   |
|--------|----------------|-----------------------------------------------|
| GET    | /albums/       | Lists all albums and meta data for each album |
| GET    | /albums/:album | Lists complete meta data and images of album  |
