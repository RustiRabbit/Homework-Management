var express = require('express')
var router = express.Router()
var path = require('path');
var passport = require('passport');

//Middleware
router.use(passport.initialize());
router.use(passport.session());

//Serve Home Page
router.get('/', isLoggedIn, function(req, res){
    res.render('app/app', { user: req.user});
});
  
//Serve Duework Page
router.get('/duework', isLoggedIn, function(req, res){
    res.render('app/duework');
});

//Serve Login Page
router.get('/login', function(req, res){
    var message = req.query.error;
    res.render('app/login', {infomation: message});
 });

//Login
router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            res.status(200).send("ERROR 200. " + res);
        } else if (info) {
            res.status(401).send("401 Unauthorized")
        } else {
            req.login(user, function(err) {
                if (err) {
                    res.status(500).send("REQ.LOGIN ERROR");
                } else {
                    res.redirect('/app')
                }
            })
        }
    })(req, res, next);
});

//Serve Login Page
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
 });

//Test if the app logged in
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/app/login');
  }
  

module.exports = router