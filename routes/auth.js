const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const router = express.Router()
const blockchain = require('../helpers/blockchain')

const passportConfig = require('../config/passport')
const User = require('../models/User')
const config = require('../config/main')

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const requireLogin = passport.authenticate('local', {
  session: false
})

// --------------------
// Registration route
// --------------------
router.post('/register', function (req, res, next) {
  // Check for registration errors
  const username = req.body.delegate
  const password = req.body.password
  console.log(username + ' -> ' + password)

  // Return error if no delegate name provided
  if (!username) {
    return res.status(422).send({
      error: 'You must enter a delegate name.'
    })
  }

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({
      error: 'You must enter a password.'
    })
  }

  User.findOne({
    delegate: username
  }, function (err, existingUser) {
    if (err) {
      console.log(err)
      return next(err)
    }

    // If user is not unique, return error
    if (existingUser) {
      console.log('This delegate is already registered.')
      return res.status(422).send({
        error: 'This delegate is already registered.'
      })
    }

    blockchain.getDelegate(username, function (err, delegate) {
      if (err) {
        return res.status(422).send({
          success: false,
          error: 'This delegate do not exist'
        })
      }

      // If email is unique and password was provided, create account
      let user = new User({
        delegate: username,
        password: password,
        profile: {
          address: delegate.address,
          publicKey: delegate.publicKey
        }
      })

      user.save(function (err, user) {
        if (err) {
          return next(err)
        }

        console.log(user)

        let userInfo = {
          delegate: user.delegate,
          password: user.password
        }

        // Respond with JWT if user was created
        res.status(201).json({
          token: 'JWT ' + generateToken(userInfo),
          user: user
        })
      })
    })
  })
})

// --------------------
// Login route
// --------------------
router.post('/login', requireLogin, function (req, res, next) {
  let user = req.body

  console.log(user)

  res.status(200).json({
    token: 'JWT ' + generateToken(user),
    user: user
  })
})

// --------------------
// Functions
// --------------------

function generateToken (user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080 // in seconds
  })
}

function roleAuthorization (role) {
  return function (req, res, next) {
    const user = req.user

    User.findById(user._id, function (err, foundUser) {
      if (err) {
        res.status(422).json({
          error: 'No user was found.'
        })
        return next(err)
      }

      // If user is found, check role.
      if (foundUser.role === role) {
        return next()
      }

      res.status(401).json({
        error: 'You are not authorized to view this content.'
      })
      return next('Unauthorized')
    })
  }
}

module.exports = router
