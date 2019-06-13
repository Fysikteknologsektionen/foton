var express = require('express');
var fs = require('fs');
var app = express();


function js(){
    //var scriptPath = __dirname + "/bassida.js"
    //var scriptPath = __dirname + "/frontend_custom_everything/index.html"
    var scriptPath = __dirname + "/frontend/index.html"
    var options = {encoding:'utf-8', flag:'r'};

    var buffer = fs.readFileSync(scriptPath, options);
    return buffer;
};

// Generates urls on the form (urlstart + category + filename) where category is the name of the folders in bildfolder and filename is the names of the files in said folder. 
function generatePicUrls(){
    var bildfolder = __dirname + '/images/'

    function addBildUrls (category) {
        var urlstart = 'http://localhost:3000/images/';

        var suburls = [];
        fs.readdirSync(bildfolder + category).forEach(function(file) {
            if (file != "thumbnails") {
                suburls.push(urlstart + category + '/' + file);
            }
        });
        return suburls
    }

    var urls = {};

    fs.readdirSync(bildfolder).forEach(function(category) {
        urls[category] = addBildUrls(category);
    });

    return JSON.stringify(urls);
}


app.get('/', function(req, res){
	res.send('<script> var urls = ' + generatePicUrls() + ";</script>" + js());
});


var images = require('./images.js');
app.use('/images', images);

var frontend = require('./frontend.js');
app.use('/frontend', frontend);

app.listen(3000);
