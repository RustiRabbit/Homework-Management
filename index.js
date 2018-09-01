var app = require('express')();
var express = require('express');
var path = require('path');
var http = require('http')
require('dotenv').load()
const PORT = process.env.PORT || 5000

//Server Var Creation
//Server
var server = http.createServer(app);

//Hashing
var bcrypt = require('bcrypt');
const saltRounds = process.env.SALTROUNDS;

//Databse
const { Pool, Client } = require('pg')
var datauseSSL;
if (process.env.DATASUPPORTSSL == "false") {
  datauseSSL = false;
} else {
  datauseSSL = true;
}

//Database
const client = new Client({
  connectionString: process.env.DATAURI,
  ssl: datauseSSL,
});
client.connect();

//Passport
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//Passport Local 
passport.use(new Strategy((username, password, cb) => {
  client.query("SELECT id, username, password, firstname, lastname, email, type FROM users WHERE username='" + username + "'", (err, res) => {
    if (res.rows[0] == null) {
      console.log("It doesn't match")
      cb(null, false)
    } else if (err) {
      console.log(err)
    } else {
      console.log("Database username = " + res.rows[0].username)
      console.log("Databse id = " + res.rows[0].id);
      if (username == res.rows[0].username) {
        bcrypt.compare(password, res.rows[0].password, function(err, answer) {
          if (answer == true) {
            cb(null, { id: res.rows[0].id, username: res.rows[0].username, firstname: res.rows[0].firstname, lastname: res.rows[0].lastname, email: res.rows[0].email, type: res.rows[0].type})
            console.log("logged in!")

          } else {
            console.log("Wrong Password")
          }
        });
      } else {
        cb(null, false)
        console.log("Wrong Username")
      }
    }
  })
  
}))

//Passport Google OAuth 2.0
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/app/auth/google/callback"
  }, function(accessToken, refreshToken, profile, done) {
    console.log("Google ID: " + profile.id);
    console.log("First Name: " + profile.name.givenName);
    console.log("Last Name: " + profile.name.familyName);
    console.log("Email: " + profile.emails[0].value)
  }
));

//Serialize Users (Add them to req)
passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, JSON.stringify(user));
});

//Deserialize Users (Remove them from req)
passport.deserializeUser(function(packet, done) {
  done(null, JSON.parse(packet));
});

//Express Setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
/*app.use(passport.initialize());
app.use(passport.session());*/

app.use(function(req, res, next){
  res.locals.user = req.user || null
  next();
})


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
  res.render('404')
});

//Server Close Functions (Everything should lead to this)
function ServerClose(serverclose) {
  console.log("*** Closing Server ***")
  //This works out if you are closing the server forcfully (Ctrl+C) or closing server.close).

  client.end();

  //If you aren't using server.close, than close the process, otherwise server.close will do it for you
  if(serverclose == false) {
    process.exit(0);
  }
}

server.on('close', function() {ServerClose(true);})

//Fixes Ctrl+C
process.on('SIGINT', function() {
  ServerClose(false);
});

//Listen
server.listen(PORT, function(){
  console.log("Starting Server");
  console.log(`Listening on *:${PORT}`);
});   