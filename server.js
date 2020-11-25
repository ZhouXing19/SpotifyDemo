require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose');
const session = require('express-session');
const fs = require('fs');
const envfile = require('envfile');


var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var morgan = require("morgan");
var querystring = require('querystring');
var request = require('request'); // "Request" library

const demoquery = require('./routes/demoquery');
const PlaylistRouter = require('./routes/playlists');
const Login = require('./Authorization/Login');
const LoginCallback = require('./Authorization/LoginCallback');
const Recommendations = require('./routes/Recommendations');
const GetPopular = require('./routes/controllers/getPopular');


var stateKey = 'spotify_auth_state';

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
    };

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser : true})
const db = mongoose.connection;

db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to db'));


const app = express();

app.get('/', (req, res) => {
    res.redirect('/login');
})

app.get('/login', Login.login);

app.get('/getPopular', GetPopular.GetPopularArtists);

app.get('/callback', LoginCallback.loginCallBack);

app.use('/recommendations', Recommendations);

app.use("/playlists", PlaylistRouter);

app.get('/albumnInfo/:id', demoquery.getAlbum);

app.listen(3007, () => console.log('Server Started'));