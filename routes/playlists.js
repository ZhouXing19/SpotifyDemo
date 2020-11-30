const express = require('express')
const router = express.Router();
const got = require('got');
const getSeed = require('./controllers/getSeed');
const byTargetBPM = require('./controllers/byTargetBPM');

router.get("/", (req, res) =>{
    res.send("hello world");
})

router.get("/BPM/:BPM", async (req, res) =>{
    try {
        const seed = await getSeed.getSeed();

        console.log("playlists", seed);

        let BPM = req.params.BPM;

        let pl1 = {}
        
        await byTargetBPM.GetPlaylistsByTargetBPM(BPM, seed)
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

router.get("/Al", (req, res) =>{

})


module.exports = router;