var express = require('express')
var router = express.Router()
var path = require('path');
require('dotenv').load()
const { Pool, Client } = require('pg')

//Database
var datauseSSL;
if (process.env.DATASUPPORTSSL == "false") {
  datauseSSL = false;
} else {
  datauseSSL = true;

}
const client = new Client({
    connectionString: process.env.DATAURI,
    ssl: datauseSSL,
  });
client.connect();

//Duework
router.get('/duework/change', function(req, res) {
    if(req.query.value && req.query.id != null) {
        client.query("UPDATE duework SET complete=$1 WHERE id=$2", [req.query.value, req.query.id], function(err, responce) {
            if(err) {
                console.log("ERROR: " + err);
            } else {
                console.log("Updated Record");
            }
        });
    } else {
        res.status(200).send("Your running this like a test");
    }

});

router.get('/duework/remove', function(req, res) {
    if (req.query.id != null) {
        client.query("DELETE FROM duework WHERE id=$1", [req.query.id], function(err, responce) {
            if(err) {
                console.log("ERROR: " + err);
            } else {
                console.log("Removed Record");
            }
        });
    } else {
        res.status(200).send("Your running this like a test")
    }
});

router.get('/duework/edit', function(req, res) {
    if(req.query.label && req.query.duedate && req.query.id != null) {
        client.query("UPDATE duework SET worklabel=$1, duedate=$2 WHERE id=$3", [req.query.label, req.query.duedate, req.query.id], function(err, responce) {
            if (err) {
                console.log(err)
            } else {
                console.log("Updated Record")
                res.status(200).send("It worked")
            }
        });
    } else {
        res.status(200).send("Your running this like a test")
    }

});

//Subjects
router.get('/subjects/remove', function(req, res) {
    if(req.query.id != null) {
        client.query("DELETE FROM duework WHERE subjectid=$1", [req.query.id], function(err, responce) {
            if(err) {
                console.log("ERROR: " + err);
            } else {
                client.query("DELETE FROM subjects WHERE id=$1", [req.query.id], function(err, responce) {
                    if (err) {
                        console.log("ERROR: " + err);
                    } else {
                        console.log("Updated Record");
                    }
                });
                
            }
        });
    } else {
        res.status(200).send("Your running this like a test")
    }

});

router.get('/subjects/edit', function(req, res) {
    if(req.query.subjectname && req.query.id != null) {
        client.query("UPDATE subjects SET subjectname=$1 WHERE id=$2", [req.query.subjectname, req.query.id], function(err, responce) {
            if (err) {
                console.log(err)
            } else {
                console.log("Updated Record")
                res.status(200).send("It worked")
            }
        });
    } else {
        res.status(200).send("Your running this like a test")
    }

});

//Fixes Ctrl+C
process.on('SIGINT', function() {
    client.end();
    console.log("*** CLOSED SERVER FROM ajaxRouter.js ***")
});


module.exports = router