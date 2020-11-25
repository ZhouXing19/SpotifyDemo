const express = require('express')
const router = express.Router();

router.get("/BPM/:BPM(\\d{0,})", (req, res) =>{
    let BPM = req.params.BPM;
    if (BPM === "") {
        res.send("Please sepcify the BPM");
    } else {
        res.send(BPM);
    }
    
})

router.get("/duration/:duration(\\d{0,})", (req, res) =>{
    let duration = req.params.duration;
    if (duration === "") {
        res.send("Please sepcify the duration");
    } else {
        res.send(duration);
    }
})

module.exports = router;