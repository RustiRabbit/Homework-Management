var express = require('express')
var router = express.Router()
var path = require('path');
var passport = require('passport');
require('dotenv').load()
const { Pool, Client } = require('pg')
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer')
const async = require('async');
const crypto = require('crypto')

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
                    res.render('app/app', {data: responce.rows,
                                               userid: req.user.id,
                                               subjectdata: subjectresponce.rows});
                }     
            })

        }
    })
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

//Reset Password
router.get('/user/forgot', function(req, res){
    res.render('app/forget');
});

//Post Reset Password
router.post('/user/forgot', function(req, res) {
    async.waterfall([
        function(done) {
            console.log("Generate Token");
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            })
        },
        function(token, done) {
            console.log("Find User")
            client.query("SELECT * FROM users WHERE email='" + req.body.email + "'" ,  (err, responce) => {
                if(err) {
                    console.log("There was an error with the Database. ERROR: " + err);
                } else {
                    if(responce.rows.length == 0 ) {
                        res.send("You account dosn't exist")
                    } else if(responce.rows[0].logintype == "google") {
                        res.send("This account is a Google OAuth account. Please login with your Google Account")                        
                    } else {
                        var name = responce.rows[0].firstname + " " + responce.rows[0].lastname
                        var email = responce.rows[0].email;
                        client.query("UPDATE users SET resettoken=$1 WHERE email=$2", [token, req.body.email], (err, responce) => {
                            if(err) {
                                console.log("There was an error when setting Reset Token")
                                res.send("There was an error when setting the reset token")
                            } else {
                                done(err, token, name, email)
                            }
                        });
                        
                    }

                }
            });
        },
        function(token, name, email, done) {
            var err = sendMail('"Homework.School Reset Password" <reset@homework.school>', email, 'Reset your Password', "<h1>Homework.School Reset Password</h1><br><p>Hi " + name + ", We got a request to reset your password. If this wasn't you then you don't need to worry, you can discard this email. <br> If it was you then click here: <a href='" + process.env.EMAIL_START_LINK + "/app/user/reset?token=" + token + "'>Reset your password</a></p>" )
            
            if(!err) {
                done(err, "done");
            }
            
        }
    ], function(err, result) {
        res.send("If your account exist, you should get an email with details on how to recover you account");
    })

    
});

router.get('/user/reset', function(req, res){
    if(req.query.token == null) {
        res.send("You need a token. Please go back to your emails and click on the link provided");
    } else {
        res.render('app/changepassword');
    }
});

router.post('/user/reset', function(req, res){
    console.log("Token: " + req.query.token)
    client.query("SELECT * FROM users WHERE resetToken=$1", [req.query.token], (err, UserResponce) => {
        if (err) {
            console.log("Error: " + err)
            res.send("There was a error with the Database");
        } else if(UserResponce.rows.length == 0) {
            res.send("The token is invalid");
        } else {
            console.log("Found a user with ResetToken")
            if(req.query.token == UserResponce.rows[0].resettoken) {
                console.log("The token's match")
                bcrypt.hash(req.body.password, 10, function(err, hash) {
                    if(err) {
                        console.log("Error with Hash: " + err)
                        res.send("There was an error with Hashing the password")
                    }
                    hashPassword = hash;
                    console.log("Hashed the password: " + hash);
                    client.query("UPDATE users SET password=$1 WHERE id=$2", [hashPassword, UserResponce.rows[0].id], (err, responce) => {
                        if(err) {
                            console.log("There was an error with Changing the Password in the Database. ERR: " + err);
                            res.send("There was an error with Changing the database");
                        } else {
                            client.query("UPDATE users SET resettoken=null WHERE id=$1", [UserResponce.rows[0].id], (err,responce) => {
                                if(err) {
                                    console.log("There was a error when removing the Token from the Database. ERR: " + err);
                                    res.send("There was a problem when removing the token from thte database");
                                }
                                console.log("Finished!")
                                res.send("The password has been changed. <a href='/app/login'>Login here</a>");
                            });
                            sendMail('"Homework.School Reset Password" <reset@homework.school>', UserResponce.rows[0].email, 'Your Password has been changed', "<h1>Your Homework.School password has been changed</h1><br><p>If this wasn't you, please go <a href='" + process.env.EMAIL_START_LINK + "/app/user/forgot'>here</a> and change your password</p>")
                        }
                    });
                });

            }
        }
    });

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

function sendMail(from, to, subject, html) {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SMTP,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: from, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: html
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        return err;
    });
}

module.exports = router