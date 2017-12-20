var express = require('express');
var router = express.Router();
var db = require("../DBHandler");
var Filter = require('bad-words');



var filter = new Filter();
filter.addWords('hello');


//Entry
router.post('/entry/add', (req, res) => {
    var data = req.body;
    data.content = filter.clean(data.content);
    var entry = new db.Entry({
        sender: data.sender,
        content: data.content,
        date: Date.now(),
        Tags: [],
        Topic: data.Topic == "" ? null : data.Topic,
        AnswerTo: data.AnswerTo,
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

router.post('/entry/bytopic', (req, res) => {
    var topic = req.body.topic;
    db.getEntriesByTopic(topic, (data,err) => {
        if(err) res.sendStatus(404);
        else{
            res.send(JSON.stringify(data));
        }
    })
});

router.post('/entry/query', (req, res) => {
    var query = req.body;
    console.log(query);
    db.getEntriesByQuery(query, (data,err) => {
        if(err) {
            console.log(err);
            res.sendStatus(404);
        }
        else{
            res.send(JSON.stringify(data));
        }        
    })
});

router.post('/entry/vote', (req, res) => {
    var id = req.body.id;
    var isNegative = req.body.isNegative;

    db.voteOnEntry(id, isNegative, (err) => {
        if(err){
            res.sendStatus(404);            
        }else{
            res.send();
        }
    })

})

//Topic
router.post('/topic/list', (req, res) => {
    var amount = parseInt(req.body.amount);    

    db.getTopics(amount, (data,err) => {
        if(err)  res.sendStatus(404);
        else{
            res.send(JSON.stringify(data));
        }
    });
});


module.exports = router;