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

router.get('/test', function(req, res) {
    res.send('This is a test');
});

router.get('/duework/change', function(req, res) {
    console.log("Duework ID: " + req.query.id + ". Value: " + req.query.value);
    const client = new Client({
        connectionString: process.env.DATAURI,
        ssl: datauseSSL,
      });
    client.connect();
    client.query("UPDATE duework SET complete=$1 WHERE id=$2", [req.query.value, req.query.id], function(err, res) {
        if(err) {
            console.log("ERROR: " + err);
        } else {
            console.log("Updated Record");
        }
    });
});

module.exports = router