var app = require('express')();
var express = require('express');
var path = require('path');
var http = require('http').Server(app);
const PORT = process.env.PORT || 5000

//Routers
var webRouter = require('./routers/webRouter');
var appRouter = require('./routers/appRouter');

//Static Files
app.use('/static', express.static(path.join(__dirname, 'public')))

//Use Router
app.use('/', webRouter)
app.use('/app', appRouter)

//The 404 Route
app.get('*', function(req, res){
  res.sendFile(__dirname + '/public/404.html');
});

http.listen(PORT, function(){
    console.log("Starting Server");
    console.log(`Listening on *:${PORT}`);
});   