var express = require('express')
var router = express.Router()
var path = require('path');

router.get('/test', function(req, res) {
    res.send('This is a test');
});

module.exports = router