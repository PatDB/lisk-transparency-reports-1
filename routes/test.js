var express = require('express');
var router = express.Router();
var request = require('request');

router.post('/', function (req, res, next) {

  data = {
    senderId: req.body.address,
    limit: "100"
  };

  request.get({
    url: "https://login.lisk.io/api/transactions",
    qs: data,
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      if (body.success) {
        res.send(body);
      } else {
        res.send("API error.");
      }
    } else {
      res.send(error);
    }
  });
});

module.exports = router;