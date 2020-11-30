const express = require('express')
const router = express.Router();
const got = require('got');
const getSeed = require('./controllers/getSeed');
const byTargetBPM = require('./controllers/byTargetBPM');
const byTarget = require('./controllers/byTargetFeature');

const fields = ["tempo", "duration", "energy", "liveness", "loudness", "popularity", "speechiness"];
var BPM = 120;
var duration = 240000;
var energy = 0.5;
var liveness = 0;
var loudness = 0;
var minPopularity = 100;
var speechiness = 0;

router.get("/", async (req, res) =>{

    try {
        const seed = await getSeed.getSeed();

        console.log("playlists", seed);


        const params = {
            tempo: req.query.tempo === undefined ? BPM : req.query.tempo,
            duration: req.query.duration === undefined ? duration : req.query.duration,
            energy: req.query.energy === undefined ? energy : req.query.energy,
            liveness: req.query.liveness === undefined ? liveness : req.query.liveness,
            loudness: req.query.loudness === undefined ? loudness : req.query.loudness,
            minPopularity: req.query.minPopularity === undefined ? minPopularity : req.query.minPopularity,
            speechiness: req.query.speechiness === undefined ? speechiness : req.query.speechiness,  

        }


        console.log("duration: ", req.query.energy);

        let pl1 = {}
        
        await byTarget.GetPlaylistsByTarget(params, seed)
                            .then((playlists) => {
                                pl1 = playlists;
                            }).catch(err => {
                                console.log(err);
                            });;

        res.send(pl1);
    } catch(err) {
        res.send(err);
    }


})



module.exports = router;