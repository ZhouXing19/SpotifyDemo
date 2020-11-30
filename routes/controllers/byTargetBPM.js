const CONSTANTS = require('../../util/Constants');
var request = require('request'); // "Request" library
require('dotenv').config()
const access_token = process.env.ACCESS_TOKEN;

var tracksNameIdLst = [];

var getTrack = (body) => {
    const tracks = body.tracks;
    for(let track of tracks) {
        var trackName = track.name;
        var urilst = track.uri.split(':');
        var trackId = urilst[urilst.length-1];
        tracksNameIdLst.push({
            name: trackName,
            id: trackId
        });
    }
    return tracksNameIdLst;
}

var getPlaylistsByTargetBPM = (BPM, seed) => new Promise((resolve, reject) =>{

    const artistId = seed.artist.id;
    const trackId = seed.track.id;
    const seedGenre = "work-out";
    const market = "US";


    const subpath = '?' + 'market=' + market 
                        + '&seed_artists=' + artistId
                        + '&seed_tracks' + trackId
                        + '&seed_genres=' + seedGenre
                        + '&target_tempo=' + BPM;

    const options = {
        url: CONSTANTS.API_ENDPOINTS.recommendations_endpoint + subpath,
        headers: { 'Authorization': 'Bearer ' + access_token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'},
        json: true
    }

    //console.log("byTargetBPM", seed);

    request.get(options, (err, response, body) => {
        if (err) {
            reject(err);
        } else if (response.statusCode === 200){
            resolve(getTrack(body));
        } else {
            reject("get byTargetBPM error");
        }
        
    });


});

module.exports ={
    GetPlaylistsByTargetBPM: getPlaylistsByTargetBPM
}