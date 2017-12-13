var express = require('express');
var router = express.Router();
var db = require("../DBHandler");

//Entry
router.post('/entry/add', (req, res) => {
    var data = req.body;
    var entry = new db.Entry({
        sender: data.sender,
        content: data.content,
        date: Date.now(),
        Tags: [],
        Topic: data.Topic,
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

router.get('/entry/list', (req,res) => {
    db.getEntries((data,err) => {
        if(err) res.sendStatus(404);
        else{
            res.send(JSON.stringify(data));
        }        
    })
});

//Topic
router.get('/topic/list', (req, res) => {
    var amount = parseInt(req.body.amount);

    db.getTopics(amount, (data,err) => {
        if(err)  res.sendStatus(404);
        else{
            res.send(JSON.stringify(data));
        }
    });
});


module.exports = router;