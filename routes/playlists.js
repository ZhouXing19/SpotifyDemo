const express = require('express')
const router = express.Router();
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

        const pl1 = await byTargetBPM.GetPlaylistsByTargetBPM(BPM, seed);

        res.send(pl1);
    } catch(err) {
        res.send(err);
    }
})

router.get("/Al", (req, res) =>{

})


module.exports = router;