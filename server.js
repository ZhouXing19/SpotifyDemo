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
const Login = require('./Authorization/Login')
const LoginCallback = require('./Authorization/LoginCallback')



mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser : true})
const db = mongoose.connection;

db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to db'));


const app = express();

app.get('/login1', Login.login);

app.get('/callback', LoginCallback.loginCallBack);

app.use("/playlists", PlaylistRouter);

app.get('/albumnInfo/:id', demoquery.getAlbum);

app.listen(3007, () => console.log('Server Started'));