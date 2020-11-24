const express = require('express')
const router = express.Router();

router.get("/", (req, res) =>{
    res.send("hello world");
})

router.get("/BPM/:BPM", (req, res) =>{
    let BPM = req.params.BPM;
    console.log(BPM);
})

router.get("/Al", (req, res) =>{

})


module.exports = router;