var express = require('express');
var router = express.Router();
var db = require("../DBHandler");
var User = require("../DBHandler").User;
var Entry = require("../DBHandler").Entry;
var Topic = require("../DBHandler").Topic;
var passport = require('passport');

router.get('/modlist', isLoggedIn, function (req, res) {
    //get data from DB
    User.find({}, function (err, data) {
        if (err) throw err;
        res.render('admin/modlist', { users: data });
    });
});

router.get('', (req, res) => {
    res.redirect("/admin/mod");
})

router.get('/mod', isLoggedIn, function (req, res) {
    //get data from DB
    Entry.find({}, function (err, data) {
        if (err) throw err;
        res.render('admin/modview', { feeds: data });
    });
});

router.get('/live',isLoggedIn, function(req,res){
	//get data from DB
	Entry.find({},function(err, data){
		if(err) throw err;
			res.render('admin/live',{feeds: data});
	});
});

router.delete('/modlist/:item', isLoggedIn, function (req, res) {
    console.log('delete worked');
    console.log(req.params.item);
    //delete requested item from db
    User.findById(req.params.item.replace(/\-/g, "")).remove(function (err, data) {
        if (err) throw err;
        res.json(data);
    });
});

router.delete('/:item', function (req, res) {
    console.log(req.params.item);
    var topicTitle = req.body.topic;
    //delete requested item from db
    Entry.findById(req.params.item.replace(/\-/g, "")).remove(function (err, data) {
        if (err) throw err;
        console.log(topicTitle);
        if(topicTitle != ""){
            Topic.findOne({Title: topicTitle}).exec((err,topic) => {
                console.log(topic);
                if(err) return;
                if(topic != null){
                    if(topic.EntryAmount > 1){
                        topic.EntryAmount--;
                        Topic.update({_id: topic._id}, topic, function(err, raw){
                            if(err) throw err;
                            res.json(data);
                        });
                    }else{
                        Topic.findById(topic._id).remove().exec((err, t) => {
                            res.json(data);
                        })
                    }
                }
                else{
                    res.json(data);
                }
            })
        }
        else{
            res.json(data);
        }
        
    });
});

router.get('/login', function (req, res) {
    res.render('admin/login.ejs', { message: req.flash('loginMessage') });
});
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/admin/mod',
    failureRedirect: '/admin/login',
    failureFlash: true
}));

router.get('/signup', function (req, res) {
    res.render('admin/signup.ejs', { message: req.flash('signupMessage') });
});


router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/admin/mod',
    failureRedirect: '/admin/signup',
    failureFlash: true
}));

router.get('/:username/:password', function(req, res){
    var newUser = new User();
    newUser.local.username = req.params.username;
    newUser.local.password = req.params.password;
    console.log(newUser.local.username + " " + newUser.local.password);
    newUser.save(function(err){
        if(err)
            throw err;
    });
    res.send("Success!");
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});


router.get('/cleardb', isLoggedIn, function(req, res) {
    db.clearDatabase((err) => {
        if(err) throw err;
        res.redirect("/");
    })
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/admin/login');
}

module.exports = router;