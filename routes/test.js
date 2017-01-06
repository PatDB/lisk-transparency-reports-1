var express = require('express');
var router = express.Router();
var request = require('request');

router.post('/', function (req, res, next) {

  console.log(req.body.address);

  data = {
    senderId: "3157131511699993997L"
  }

  request.post("https://login.lisk.io/api/transactions", data, function (error, response, body) {
    if (!error) {
      console.log(body) // Show the HTML for the Google homepage. 
    } else {
      console.log(error);
    }
  })
});

module.exports = router;