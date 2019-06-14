var express = require('express');
var fs = require('fs');
var app = express();

const CATEGORY_URL = '/category/';

var categoriesJSON = {"categories" : []};

function updateCategoriesObject() {
    var categories = [];

    const urlstart = 'http://localhost:3000/images/';
    const imageFolder = __dirname + '/images/';

    fs.readdirSync(imageFolder).forEach(function (directory) {
        const firstImageURL = getFirstImageURL(imageFolder + directory);

        if (typeof firstImageURL !== 'undefined') {
            categories.push({"title" : directory, "img" : urlstart + directory + '/' + firstImageURL, "link" : encodeURI(directory)});
        }
    });

    categoriesJSON = JSON.stringify({"categories": categories});
}

// Update categoriesJSON every minute for now
updateCategoriesObject();
setInterval(updateCategoriesObject, 60000);

// Find the URL of the first image in the directory
function getFirstImageURL(directory) {
    return fs.readdirSync(directory).find(function (file) {
        return isImagePath(file);
    });
}

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
    fs.readFile('frontend/index.html', 'utf8', function (err, data) {
        if (err) {
            load404Page(req, res);
        } else {
            res.send(insertScript(data, 'var categories = ' + categoriesJSON + ';'));
        }
    });
}

// Loads a page display the images in a category (in some sort of grid)
function loadCategoryPage(req, res) {
    const categoryUrlName = req.url.substr(CATEGORY_URL.length);

    console.log(categoryUrlName);

    if (categoryUrlName.length == 0) {
        res.redirect('/');
    } else {
        // TODO 
    }
}

// Loads a 404 page
function load404Page(req, res) {
    res.send('404!');
}

app.get('/index.html', loadCategoryListPage);
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