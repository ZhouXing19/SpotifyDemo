const CONSTANTS = require('../../util/Constants');
var request = require('request'); // "Request" library
require('dotenv').config()
const access_token = process.env.ACCESS_TOKEN;


const market = 'US';
const fields = 'items(track)';
const playlistId = CONSTANTS.PLATLISTS_ID.global_top_50;
const subpath = playlistId + '/tracks?market=' + market + '&fields=' + fields;



var getArtistNameIdMap = (body, artistNameIdMap) => {
    for (let item of body.items) {
        var artists = item.track.artists;
        for (let artist of artists) {
            var artistName = artist.name;
            var artistId = artist.id;
            if (artistNameIdMap[artistName] === undefined) {
                artistNameIdMap[artistName] = {
                    "id": artistId,
                    "frequency" : 1
                }
            } else {
                artistNameIdMap[artistName].frequency += 1;
            }
        }
    }
    return artistNameIdMap;
}

var getPopularArtists = async (req, res) => {
    //https://nodejs.org/api/http.html#http_http_request_options_callback
    var options = {
        url: CONSTANTS.API_ENDPOINTS.playlist_endpoint + subpath,
        headers: { 'Authorization': 'Bearer ' + access_token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'},
        json: true
    }
    
    request.get(options, function(error, response, body) {
        var artistNameIdMap = {};
        artistNameIdMap = getArtistNameIdMap(body, artistNameIdMap);
        res.send(artistNameIdMap);
    })

    


}


module.exports = {
    GetPopularArtists: getPopularArtists
}
