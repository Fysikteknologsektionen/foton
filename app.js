const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.get('/image/:id', (req, res) => {
    res.json('Fetching image ' + req.params.id);
});


app.listen(3000, () => {
    console.log('Express listening on port 3000');
});
