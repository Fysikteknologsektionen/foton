var express = require('express');
var fs = require('fs');
var app = express();

const CATEGORY_URL = '/category/';
const IMAGES_URL = '/images/';

// Contains information on the structure of categories and images on the server. These are sent to the client to parse.
var categoriesJSON = "";
var imagesJSONs = {};

// Updates the variables categoriesJSON and imagesJSONs which only needs updating when pictures/categories are added/removed from the "database"
function updateJSON() {
    var categories = [];
    var images = {};

    const urlstart = 'http://localhost:3000/images/';
    const imageFolder = __dirname + IMAGES_URL;

    fs.readdirSync(imageFolder).forEach(function (directory) {
        var categoryImages = [];
        fs.readdirSync(imageFolder + directory).forEach(function (file) {
            if (isImagePath(file)) {
                categoryImages.push({ "src": urlstart + directory + '/' + file });
            }
        });

        if (categoryImages.length > 0) {
            var category = { 'title': directory, 'url': encodeURI(CATEGORY_URL + directory) };

            if (typeof categoryImages[0].thumbnail !== 'undefined') {
                category.img = categoryImages[0].thumbnail;
            } else if (typeof categoryImages[0].src !== 'undefined') {
                category.img = categoryImages[0].src;
            }

            categories.push(category);
            images[directory] = JSON.stringify({ 'images': categoryImages });
        }
    });

    categoriesJSON = JSON.stringify({ 'categories': categories });
    imagesJSONs = images;
}

// Update categoriesJSON every minute (60000 milliseconds) for now
updateJSON();
setInterval(updateJSON, 60000);

// Naive way of checking if path is a path to an image
function isImagePath(path) {
    return endsWithAny(path.toLowerCase(),
        ['.jpg', '.jpeg', '.jpe', '.jif', '.jfif', '.jfi', '.gif', '.png',
            '.bmp', '.dib', '.ico', '.svg', '.svgz', '.webp', '.apng', '.xmb']);
}

// Checks if the string value ends with any of the suffixes
function endsWithAny(value, suffixes) {
    return suffixes.some(function (suffix) {
        return value.endsWith(suffix);
    });
}

// Naive way of adding dynamic javascript to html page: Just append it first in the head-tag
function insertScript(html, script) {
    const headIndex = html.indexOf('<head>') + 6;
    return headIndex >= 0 ? html.slice(0, headIndex) + '<script type="text/javascript">' + script + '</script>' + html.slice(headIndex) : html;
}

// Loads a page displaying a list of categories
function loadCategoryListPage(req, res) {
    fs.readFile('frontend/categories.html', 'utf8', function (err, data) {
        if (err) {
            load404Page(req, res);
        } else {
            res.send(insertScript(data, 'const cat = ' + categoriesJSON + ';'));
        }
    });
}

// Loads a page display the images in a category (in some sort of grid)
function loadCategoryPage(req, res) {
    const path = req.url.substr(CATEGORY_URL.length);
    const forwardSlash = path.indexOf('/');

    if (forwardSlash < 0) {
        // Urls like localhost:3000/category/brandbilder will be redirected to localhost:3000/category/brandbilder/ (<- note the extra slash)
        res.redirect(req.url + '/');
        return;
    }

    const categoryUrlName = decodeURI(path.substr(0, forwardSlash));

    if (categoryUrlName.length == 0) {
        // Urls like localhost:3000/category/ will be redirected to localhost:3000/
        res.redirect('/');
    } else if (imagesJSONs.hasOwnProperty(categoryUrlName)) {
        const subDir = path.substr(forwardSlash + 1);

        if (subDir.length == 0) {
            // Urls like localhost:3000/category/brandbilder/ will return the html file for displaying an image grid (images.html)
            fs.readFile('frontend/images.html', 'utf8', function (err, data) {
                if (err) {
                    load404Page(req, res);
                } else {
                    res.send(insertScript(data, 'const img = ' + imagesJSONs[categoryUrlName] + ';'));
                }
            });
        } else {
            // Urls like localhost:3000/category/brandbilder/style.css will be redirected to localhost:3000/style.css
            res.redirect('/' + subDir);
        }
    } else {
        load404Page(req, res);
    }
}

// Loads a 404 page
function load404Page(req, res) {
    res.send('404: ' + req.url);
}

app.get('/', loadCategoryListPage);

app.get(CATEGORY_URL + '*', loadCategoryPage);

var images = require('./images.js');
app.use('/images', images);

var nodeModules = require('./node-modules.js');
app.use('/node_modules', nodeModules);

var frontend = require('./frontend.js');
app.use('/', frontend);

app.use('*', load404Page);

app.listen(3000);