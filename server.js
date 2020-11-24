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



mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser : true})
const db = mongoose.connection;

db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to db'));

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
    };


var updateAttributeEnv = function(envPath, attrName, newVal){
    var dataArray = fs.readFileSync(envPath,'utf8').split('\n');

    var replacedArray = dataArray.map((line) => {
        if (line.split('=')[0] == attrName){
            return attrName + "=" + String(newVal);
        } else {
            return line;
        }
    })

    fs.writeFileSync(envPath, "");
    for (let i = 0; i < replacedArray.length; i++) {
        fs.appendFileSync(envPath, replacedArray[i] + "\n"); 
    }
}


const app = express();
app.use(express.json());

// set morgan to log info about our requests for development use.
app.use(morgan("dev"));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(
    session({
        key: "user_sid",
        secret: "somerandonstuffs",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 600000,
        },
    })
    );




app.get("/", (req, res) => {
    res.send(`
    <h1> Hello </h1>
    <ul>
        <li> ${process.env.DATABASE_URL}</li> 
    </ul>
    <a href="/login"> Login </a>`
    );
})

var stateKey = 'spotify_auth_state';

// 1. Have your application request authorization; the user logs in and authorizes access
app.get('/login', function(req, res) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    var scope = 'user-read-private user-read-email playlist-modify-private playlist-read-private';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.REDIRECT_URI,
        state: state
        }));
    });


app.get('/callback', (req, res) => {
    let userCode = req.query.code;

    // 2. Have your application request refresh and access tokens; Spotify returns access and refresh tokens

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: userCode,
            redirect_uri: process.env.REDIRECT_URI,
            grant_type: 'authorization_code'
    },
        headers: {
        'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
    },
        json: true
    };

    request.post(authOptions, function(error, response, body){
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token,
                refresh_token = body.refresh_token;

            updateAttributeEnv('.env', 'ACCESS_TOKEN', String(access_token));
            updateAttributeEnv('.env', 'REFRESH_TOKEN', String(refresh_token));

            // 3. Use the access token to access the Spotify Web API; Spotify returns requested data
            var options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
                };
            
            request.get(options, function(error, response, body) {
                res.send(`
                <h1> Welcome Back! </h1>
                Username: <b> ${body.display_name}</b> 
                <br/>
                Email: <b> ${body.email}</b>
                <br/>
                AccessCode: ${access_token}`)

            });


        }

    });

})


app.use("/playlists", PlaylistRouter);

app.get('/albumnInfo/:id', demoquery.getAlbum);

app.listen(3007, () => console.log('Server Started'));