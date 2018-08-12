var express = require('express')
var router = express.Router()
var path = require('path');
var passport = require('passport');
var ensure_login = require('connect-ensure-login')

//Serve Home Page
router.get('/', ensure_login.ensureLoggedIn('/app/login'), function(req, res){
    res.render('app/app', { username: req.session.passport.user});
});

//Serve Duework Page
router.get('/duework', ensure_login.ensureLoggedIn('/app/login'), function(req, res){
    res.render('app/duework');
});

//Serve Login Page
router.get('/login', function(req, res){
    var message = req.query.error;
    res.render('app/login', {infomation: message});
 });

//Login
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/app');
});


//Serve Login Page
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
 });


module.exports = router