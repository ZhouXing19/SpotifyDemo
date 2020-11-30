const getPopular = require("./getPopular");

var pickRandom = (lst) => {
    const keys = Object.keys(lst);
    const randomIndex = Math.floor(Math.random() * keys.length);
    const randomKey = keys[randomIndex];
    const content = lst[randomKey];

    return [randomKey, content];
}
var getSeed = async () => {
    const popular = await getPopular.GetPopular();

    const trackMap = popular[0];
    const artistMap = popular[1];
    const randomArtist = pickRandom(artistMap);
    const randomTrack = pickRandom(trackMap);
    

    return {artist: {
                name: randomArtist[0],
                ...randomArtist[1]
                }, 
            track:{
                name: randomTrack[0],
                ... randomTrack[1]
                }

            };
}

module.exports = {
    getSeed: getSeed
}