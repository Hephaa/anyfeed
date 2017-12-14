var express = require('express');
var router = express.Router();
var User = require("../DBHandler").User;
var Entry = require("../DBHandler").Entry;
var passport = require('passport');

router.get('/modlist', isLoggedIn, function (req, res) {
    //get data from DB
    User.find({}, function (err, data) {
        if (err) throw err;
        res.render('admin/modlist', { users: data });
    });
});
//Test


router.get('/mod', isLoggedIn, function (req, res) {
    //get data from DB
    Entry.find({}, function (err, data) {
        if (err) throw err;
        res.render('admin/modview', { feeds: data });
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
    console.log('delete worked');
    console.log(req.params.item);
    //delete requested item from db
    Entry.findById(req.params.item.replace(/\-/g, "")).remove(function (err, data) {
        if (err) throw err;
        res.json(data);
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




function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/admin/login');
}

module.exports = router;