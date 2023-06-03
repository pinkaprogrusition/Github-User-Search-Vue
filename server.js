const express = require('express');

const IP = "localhost"
const PORT = 5000

const { json } = require('express');

const app = express();

app.use(express.static(__dirname + '/static'));

app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb'}));


app.get('/', function (req, rsp) {
    rsp.sendFile(__dirname + '/views/main.html');
});
app.get('/user', function (req, rsp) {
    rsp.sendFile(__dirname + '/views/user.html');
});

app.listen(PORT, function () {
    console.log(`Server is running on ${IP}:${PORT}`)
});