const blockchain = require('../helpers/blockchain')
const User = require('../models/User')

// --------------------
// Display All delegates
// --------------------

const getDelegates = function (req, res, next) {
  User.find({
    confirmed: true
  }, function (err, users) {
    if (err) {
      res.status(500).json({
        error: 'Bonjour France.'
      })
      return next(err)
    }
    res.status(200).json({
      allUsers: users
    })
  })
}

// ---------------------
// Get user informations
// ---------------------
const getUser = function (req, res, next) {
  let username = req.query.username

  blockchain.getDelegate(username, function (err, delegate) {
    if (err) {
      return res.status(422).send({
        success: false,
        error: 'This delegate does not exist'
      })
    } else {
      return res.status(200).send(delegate)
    }
  })
}

// ----------------------
// Get forged Lisk route
// ----------------------
const getForged = function (req, res, next) {
  let publicKey = req.query.publicKey

  blockchain.getForged(publicKey, function (err, total) {
    if (err) {
      return res.status(422).send({
        success: false,
        error: 'This public key does not exist'
      })
    } else {
      return res.status(200).send(total)
    }
  })
}

module.exports = {
  getDelegates,
  getUser,
  getForged
}
