var express = require('express');
var router = express.Router();
var db = require("../DBHandler");

router.post('/addentry', (req, res) => {
    var data = req.body;
    var entry = new db.Entry({
        sender: data.sender,
        content: data.content,
        data: Date.now,
        Tags: [],
        Topic: null,
        AnswerTo: null,
        AnswerAmount: 0,
        PositiveVote: 0,
        NegativeVote: 0
    });
    db.addEntryFunction(entry, (data, err) => {
        if(err) res.sendStatus(404);
        else{
            res.send(JSON.stringify(data));
        }
    })
});

router.get('/getlist', (req,res) => {
    db.getEntries((data,err) => {
        if(err) res.sendStatus(404);
        else{
            res.send(JSON.stringify(data));
        }        
    })
});

module.exports = router;