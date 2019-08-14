# Foton Webgallery
Webgallery used by Foton at Fysikteknologsektionen at Chalmers University of Technology. Uses Node.js. Finished project at [ftek.se/gallery/](https://ftek.se/gallery/).

Developed by Fysikteknologsektionens webgroup Spidera for Foton.

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

To create thumbnails the server also needs to have the open-source tool ImageMagick installed and a timer to run `shellscripts/createThumbnails.sh` regularly. If thumbnails are not found it will fall back to the full-sized image.

## Creating albums and supplying meta information
Albums are represented by directories under `files`. Each albums require a `meta.json`file that supplies the following keys:
* name - Pretty album name
* description - Brief album description
* author - Author(s) of the images
* date - Date of the album
* thumbnail - The filename of the image contained in the album to be used as album thumbnail
* order - Integer representing the order albums should be displayed in. Higher integer means the album will be listed earlier in the grid

The album will also have a key given as the name of the album directory. OBS: This has to be safe to use as URL!

Images in albums are sorted alphabetically by their name.

## API
 A list of all albums and album details can be fetched as JSON via the API. The available parameters are:

| Method | File           | Description                                   |
|--------|----------------|-----------------------------------------------|
| GET    | /albums/       | Lists all albums and meta data for each album |
| GET    | /albums/:album | Lists complete meta data and images of album  |
