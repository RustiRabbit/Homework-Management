var app = require('express')();
var express = require('express');
var path = require('path');
var http = require('http').Server(app);
const PORT = process.env.PORT || 5000

//Static Files
app.use('/static', express.static(path.join(__dirname, 'public')))

//Serve Home Page
app.get('/', function(req, res){
  res.sendFile(__dirname + "/public/index.html");
});

//Serve Features Page
app.get('/features', function(req, res){
  res.sendFile(__dirname + "/public/features.html");
});

//Serve Header Page
app.get('/header', function(req, res){
  res.sendFile(__dirname + "/public/header.html");
});

//Serve Login Page
app.get('/app/login', function(req, res){
  res.sendFile(__dirname + "/public/app/login.html");
});

//Serve Main App Page

//FIXME - CANT GO TO THIS PAGE IF YOU AREN'T LOGGED IN
app.get('/app', function(req, res){
  res.sendFile(__dirname + "/public/app/app.html");
});

http.listen(PORT, function(){
    console.log("Starting Server");
    console.log(`Listening on *:${PORT}`);
});   