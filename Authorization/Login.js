var querystring = require('querystring');

var stateKey = 'spotify_auth_state';

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
    };

// 1. Have your application request authorization; the user logs in and authorizes access
module.exports = {
    login: async (req, res) => {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);
    var scope = 'user-read-private user-read-email playlist-modify-private playlist-read-private';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.REDIRECT_URI,
        state: state
        }));
    },

}