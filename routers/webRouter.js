var express = require('express')
var router = express.Router()
var path = require('path');

//Serve Home Page
router.get('/', function(req, res){
  res.render('index');
});

//Serve Features Page
router.get('/features', function(req, res){
   res.render('features');
});

//Serve Features Page
router.get('/changelog', function(req, res){
  res.render('changelog');
});

module.exports = router