const axios = require('axios');

async function getAlbumInfo(albumId){
    const reqUrl = 'https://api.spotify.com/v1/albums/' + albumId;
    console.log("reqUrl: " + reqUrl);
    return await axios.get(reqUrl, {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + process.env.OAUTH_TOKEN
        }
    });
}

module.exports = {
    getAlbum : async (req, res) => {
        
        let albumId = req.params.id;
        console.log("albumId: " + albumId);
        
        try {
            let albumsInfo = await getAlbumInfo(albumId);
            res.send(albumsInfo);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
}
