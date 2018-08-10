var express = require('express')
var router = express.Router()
var path = require('path');

//Serve Home Page
router.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname + "/../public/index.html"));
});
  
//Serve Features Page
router.get('/features', function(req, res){
   res.sendFile(path.resolve(__dirname + "/../public/features.html"));
});
  
//Serve Header Page
router.get('/header', function(req, res){
   res.sendFile(path.resolve(__dirname + "/../public/header.html"));
});

module.exports = router