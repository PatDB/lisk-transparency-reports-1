const jwt = require('jsonwebtoken')
const blockchain = require('../helpers/blockchain')
var request = require('request')
var api = require('../config/main').api
const User = require('../models/User')
const config = require('../config/main')

// --------------------
// Registration route
// --------------------
const register = function (req, res, next) {
  // Check for registration errors
  const username = req.body.delegate
  const password = req.body.password

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
          forge: delegate.address
        }
      })

      user.save(function (err, newUser) {
        if (err) {
          return next(err)
        }

        let userInfo = {
          _id: newUser._id,
          delegate: newUser.delegate,
          password: newUser.password
        }

        // Respond with JWT if user was created
        res.status(201).json({
          token: 'JWT ' + generateToken(userInfo)
        })
      })
    })
  })
}

// --------------------
// Login route
// --------------------
const login = function (req, res, next) {
  let user = req.user

  User.findById(req.user._id, function (err, foundUser) {
    if (err) {
      res.status(422).json({
        error: 'No user was found.'
      })
      return next(err)
    }
    let userInfo = {
      _id: user._id,
      delegate: user.delegate,
      password: user.password
    }

    res.status(200).json({
      token: 'JWT ' + generateToken(userInfo),
      confirmed: foundUser.confirmed
    })
  })
}


// --------------------
// Display All delegates
// --------------------

const getAllUsers = function (req, res, next) {
  User.find(function (err, users) {
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
  let username= req.query.username

  blockchain.getDelegate(username, function (err, delegate) {
      if (err) {
        return res.status(422).send({
          success: false,
          error: 'This delegate does not exist'
        })
      }else{
        return res.status(200).send(delegate)
      }
  })
}

// --------------------
// Amount route
// --------------------
const amount = function (req, res, next) {
  // Get user
  User.findById(req.user._id, function (err, foundUser) {
    if (err) {
      res.status(422).json({
        error: 'No user was found.'
      })
      return next(err)
    }
    // If user isn't confirmed
    if (!foundUser.confirmed) {
      // If userAmount was already generated
      if (foundUser.confirmAmount) {
        // res the amount to send stored in DB
        res.status(200).json({
          confirmed: false,
          amount: foundUser.confirmAmount,
          address: config.address
        })

        // If userAmount wasn't already generated
      } else {
        // Generate new amount
        let amount = (Math.random().toFixed(4) * 100000000).toFixed(0)
        // Store it in user document
        foundUser.confirmAmount = amount

        // Save the user document
        foundUser.save(function (err, updatedUser) {
          if (err) {
            res.status(422).json({
              error: 'Error saving user to DB.'
            })
            return next(err)
          }
          res.status(200).json({
            confirmed: false,
            amount: amount,
            address: config.address
          })
        })
      }
    } else {
      res.status(200).json({
        confirmed: true
      })
    }
  })
}

// --------------------
// Confirm route
// --------------------
const confirm = function (req, res, next) {
  let txId = req.body.txId
  // Get user
  User.findById(req.user._id, function (err, foundUser) {
    if (err) {
      res.status(422).json({
        error: 'No user was found.'
      })
      return next(err)
    }
    // If user is not confirmed
    if (!foundUser.confirmed) {
      // If userAmount was already generated
      if (foundUser.confirmAmount) {
        // Check tx in blockchain
        blockchain.checkConfirmation(foundUser.profile.forge, config.address, txId, foundUser.confirmAmount, function (err, confirmed) {
          if (err) {
            res.status(422).json({
              error: 'An error occured trying to verify tx.'
            })
            return next(err)
          } else {
            // If tx received
            if (confirmed) {
              // Mark user document as confirmed
              foundUser.confirmed = true
              // Save the user document
              foundUser.save(function (err, updatedUser) {
                if (err) {
                  res.status(422).json({
                    error: 'Error saving user to DB.'
                  })
                  return next(err)
                }
                res.status(200).json({
                  confirmed: true
                })
              })
              // res the amount to send stored in DB
            } else {
              // res the amount to send stored in DB
              res.status(200).json({
                confirmed: false,
                amount: foundUser.confirmAmount,
                address: config.address
              })
            }
          }
        })

        // If userAmount wasn't already generated
      } else {
        res.status(200).json({
          error: 'You first need to generate amount: GET /api/auth/amount'
        })
      }
    } else {
      res.status(200).json({
        confirmed: true
      })
    }
  })
}

// --------------------
// Functions
// --------------------

const generateToken = function (user) {
  return jwt.sign(user, config.secret, {
    expiresIn: config.jwtExpiresIn
  })
}

const roleAuthorization = function (role) {
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

const getForgedLisks = function (req, res, next) {
  let publicKey = req.query.publicKey

  blockchain.getForgedLisksUser(publicKey, function (err, total) {
    if(err) {
      return res.status(422).send({
        success: false,
        error: 'This public key does not exist'
      })
    }else{
      return res.status(200).send(total)
    }
  })
}


module.exports = {
  register,
  login,
  getAllUsers,
  getUser,  
  amount,
  confirm,
  generateToken,
  roleAuthorization,
  getForgedLisks
}
