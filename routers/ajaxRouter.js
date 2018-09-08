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

router.get('/test', function(req, res) {
    res.send('This is a test');
});

//Duework
router.get('/duework/change', function(req, res) {
    console.log("Duework ID: " + req.query.id + ". Value: " + req.query.value);
    client.query("UPDATE duework SET complete=$1 WHERE id=$2", [req.query.value, req.query.id], function(err, responce) {
        if(err) {
            console.log("ERROR: " + err);
        } else {
            console.log("Updated Record");
        }
    });
});

router.get('/duework/remove', function(req, res) {
    console.log("Duework ID: " + req.query.id);
    client.query("DELETE FROM duework WHERE id=$1", [req.query.id], function(err, responce) {
        if(err) {
            console.log("ERROR: " + err);
        } else {
            console.log("Removed Record");
        }
    });
});

router.get('/duework/edit', function(req, res) {
    console.log("Edit Duework: ID: " + req.query.id + ". New Label: " + req.query.label + ". Duework: " + req.query.duedate);
    client.query("UPDATE duework SET worklabel=$1, duedate=$2 WHERE id=$3", [req.query.label, req.query.duedate, req.query.id], function(err, responce) {
        if (err) {
            console.log(err)
        } else {
            console.log("Updated Record")
            res.status(200).send("It worked")
        }
    });
});

//Subjects
router.get('/subjects/remove', function(req, res) {
    client.query("DELETE FROM subjects WHERE id=$1", [req.query.id], function(err, responce) {
        if(err) {
            console.log("ERROR: " + err);
        } else {
            console.log("Updated Record");
        }
    });
});

//Fixes Ctrl+C
process.on('SIGINT', function() {
    client.end();
    console.log("*** CLOSED SERVER FROM ajaxRouter.js ***")
});


module.exports = router