const CONSTANTS = require('../../util/Constants');
var request = require('request'); // "Request" library
const got = require('got');
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


async function getPlaylistsByTarget(params, seed){
    console.log(params);
    const artistId = seed.artist.id;
    const trackId = seed.track.id;
    const seedGenre = "work-out";
    const market = "US";


    const subpath = '?' + 'market=' + market 
                        + '&seed_artists=' + artistId
                        + '&seed_tracks' + trackId
                        + '&seed_genres=' + seedGenre
                        + '&target_tempo=' + params.tempo;
                        + '&target_duration_ms=' + params.duration
                        + '&target_energy=' + params.energy
                        + '&target_liveness=' + params.liveness
                        + '&target_loudness=' + params.loudness
                        + '&min_popularity=' + params.min_popularity
                        + '&target_speechiness=' + params.speechiness;

    const url =  CONSTANTS.API_ENDPOINTS.recommendations_endpoint + subpath;
    const options = {
        headers: { 'Authorization': 'Bearer ' + access_token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'},
    }

    let results = await got(url, options).json();
    return getTrack(results);
}

module.exports ={
    GetPlaylistsByTarget: getPlaylistsByTarget
}