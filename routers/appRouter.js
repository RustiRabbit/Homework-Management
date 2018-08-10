var express = require('express')
var router = express.Router()
var path = require('path');

//Serve Home Page
router.get('/', function(req, res){
    res.sendFile(path.resolve(__dirname + "/../public/app/app.html"));
});

//Serve Duework Page
router.get('/duework', function(req, res){
    res.sendFile(path.resolve(__dirname + "/../public/app/duework.html"));
});

//Serve Login Page
router.get('/login', function(req, res){
    res.sendFile(path.resolve(__dirname + "/../public/app/login.html"));
 });

//Serve Login Page
router.get('/header', function(req, res){
    res.sendFile(path.resolve(__dirname + "/../public/app/app-header.html"));
});


module.exports = router