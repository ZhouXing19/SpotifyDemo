const CONSTANTS = require('../../util/Constants');
const got = require('got');
const request = require('request');
require('dotenv').config()
const access_token = process.env.ACCESS_TOKEN;


const market = 'US';
const fields = 'items(track)';
const playlistId = CONSTANTS.PLATLISTS_ID.global_top_50;
const subpath = playlistId + '/tracks?market=' + market + '&fields=' + fields;

let artistNameIdMap = {};
let trackNameIdMap = {};



var getTrackNameIdMap = (body) => {
    // console.log("getTrackNameIdMap");
    for (let item of body.items) {
        var uris = item.track.uri.split(":");
        var id = uris[uris.length-1];
        var name = item.track.name;
        trackNameIdMap[name] = {id};
    }

    return trackNameIdMap;
}

var getArtistNameIdMap = (body) => {
    
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


async function getPopular() {
    const options = {
        headers: { 'Authorization': 'Bearer ' + access_token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'},
    };
    const url = CONSTANTS.API_ENDPOINTS.playlist_endpoint + subpath;
    let results = await got(url, options).json();
    // update local cache object
    
    artistNameIdMap = getArtistNameIdMap(results);
    //console.log(artistNameIdMap);
    trackNameIdMap = getTrackNameIdMap(results);
    //console.log(trackNameIdMap);
    return [trackNameIdMap,artistNameIdMap];
};



module.exports = {
    GetPopular: getPopular,
}
