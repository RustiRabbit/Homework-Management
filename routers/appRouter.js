var express = require('express')
var router = express.Router()
var path = require('path');
var passport = require('passport');
require('dotenv').load()
const { Pool, Client } = require('pg')
const bodyParser = require("body-parser");

//Database SSL
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

//Hashing
var bcrypt = require('bcrypt');
const saltRounds = process.env.SALTROUNDS;

//Middleware
router.use(passport.initialize());
router.use(passport.session());
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

//Serve Home Page
router.get('/', isLoggedIn, function(req, res){
    res.render('app/app', { user: req.user});
});

//Signup Page
router.get('/signup', function(req, res){
    res.render('app/signup', { user: req.user});
});

//Post Signup
router.post('/signup', function(req, res, next){
    var hashPassword = "";
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        hashPassword = hash;
        console.log(hashPassword)
        client.query("INSERT INTO users (firstname, lastname, password, username, email, type) VALUES($1, $2, $3, $4, $5, 'user') RETURNING id", [req.body.firstname, req.body.lastname, hashPassword, req.body.username, req.body.email], function(err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('row inserted with id: ' + result.rows[0].id);
            }
            res.redirect('/app/login');
        })
    });
});
  
//Serve Duework Page
router.get('/duework', isLoggedIn, function(req, res){
    console.log("GET DUEWORK")
    var message = req.query.message;
    client.query("SELECT id, subjectid, userid, worklabel, duedate, complete FROM duework WHERE userid=$1 ORDER BY duedate ASC", [req.user.id], (err, responce) => {
        if (err) {
            res.send(err);
        } else {
            client.query("SELECT * FROM subjects WHERE userid=$1", [req.user.id], function(err, subjectresponce) {
                if(err) {
                    res.send(err)
                } else {
                    console.log(responce.rows)
                    console.log(subjectresponce.rows);
                    console.log(responce.rows[0])
                    res.render('app/duework', {data: responce.rows,
                                               message: message,
                                               userid: req.user.id,
                                               subjectdata: subjectresponce.rows});
                }     
            })

        }
    })
});

//Serve Duework Create
router.get('/duework/create', isLoggedIn, function(req, res){
    client.query("SELECT id, subjectname FROM subjects WHERE userid=$1", [req.user.id], (err, responce) => {
        if (err) {
            res.send(err);
        } else {
            console.log(responce.rows);
            res.render('app/create-duework', {data: responce.rows});
        }
    })
});

router.post('/duework/create', function(req, res, next){
    console.log("Duework Create POST")
    console.log("duedate without date(): " + req.body.duedate);
    //Fix Completed (This fixes a Bug)
    if (req.body.completed == null) {
        req.body.completed = false;
    }
    var query = {
        text: "INSERT INTO duework (subjectid, userid, worklabel, duedate, complete) VALUES ((SELECT id FROM subjects WHERE id=$1), (SELECT id FROM users WHERE id=$2), $3, $4, $5)",
        values: [req.body.subject, req.user.id, req.body.worklabel, req.body.duedate, req.body.completed]
    }
    client.query(query, (err, responce) => {
        if (err) {
            console.log(req.user.id);
            res.send(err);
        } else {
            console.log("Added a new DueWork")
            res.redirect('/app/duework?message=Added%20A%20New%20Duework');
        }
    })
});

//Serve Subjects Page
router.get('/subjects', isLoggedIn, function(req, res){
    var message = req.query.message
    client.query("SELECT id, subjectName, userID FROM subjects WHERE userID=" + req.user.id, (err, responce) => {
        if (err) {
            res.send(err);
        } else {
            console.log(responce.rows);
            res.render('app/subjects', {data: responce.rows,
                                        message: message    });
        }
    })

});

//Serve Subjects Create Page
router.get('/subjects/create', isLoggedIn, function(req, res) {
    res.render('app/create-subject')
});

router.post('/subjects/create', function(req, res, next){
    var query = {
        text: "INSERT INTO subjects (subjectname, userid) VALUES ($1, (SELECT id FROM users WHERE id=$2))",
        values: [req.body.subjectname, req.user.id]
    }
    client.query(query, (err, responce) => {
        if (err) {
            console.log(req.user.id);
            res.send(err);
        } else {
            console.log("Added new Subject")
            res.redirect('/app/subjects?message=Added%20A%20New%20Subject');
        }
    })
});

//Serve Login Page
router.get('/login', function(req, res){
    var message = req.query.error;
    if(req.user != null) {
        res.redirect('/app')
    } else {
        res.render('app/login', {infomation: message});
    }
 });

//Login
router.post('/login', function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                res.status(200).send("ERROR 200. " + res);
            } else if (info) {
                res.status(401).send("401 Unauthorized")
            } else if (!user) {
                res.redirect('/app/login?error=You%20have%20the%20wrong%20username%20or%20password')
            } else {
                req.login(user, function(err) {
                    if (err) {
                        res.status(500).send("REQ.LOGIN ERROR. Try to login again.");
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

//Google OAuth
router.get('/auth/google', passport.authenticate('google', { 
    scope: ['profile', 'email'], 
    prompt: 'select_account'}
));

router.get('/auth/google/callback', 
  passport.authenticate('google'),
  function(req, res) {
    res.redirect('/app')
  });
//Test if the app logged in
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/app/login?error=You%20need%20to%20be%20logged%20in%20to%20do%20this');
}

//Fixes Ctrl+C
process.on('SIGINT', function() {
    client.end();
    console.log("*** CLOSED SERVER FROM appRouter.js ***")
});


module.exports = router