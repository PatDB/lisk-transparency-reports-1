const jwt = require('jsonwebtoken')
const blockchain = require('../helpers/blockchain')
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

      let user = new User({
        delegate: username,
        password: password,
        addresses: [{
          address: delegate.address,
          category: 'Forge',
          confirmAmount: (Math.random().toFixed(4) * 100000000).toFixed(0)
        }]
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
  User.find({ confirmed: true }, function (err, users) {
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

// --------------------
// Amount route
// --------------------
const confirmAmount = function (req, res, next) {
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
      // res the amount to send stored in DB
      res.status(200).json({
        confirmed: false,
        amount: foundUser.confirmAmount,
        address: config.address
      })
    } else {
      res.status(200).json({
        confirmed: true
      })
    }
  })
}

// ---------------------------
// Generate a new amount route
// ---------------------------
const resetPasswordAmount = function (req, res, next) {
  // Get user
  let delegate = req.query.delegate
  User.findOne({
    delegate: delegate
  }, function (err, foundUser) {
    if (err) {
      res.status(422).json({
        error: 'No user was found.'
      })
      return next(err)
    }
    if (foundUser.resetPasswordAmount) {
      res.status(200).json({
        amount: foundUser.resetPasswordAmount,
        address: config.address
      })
    } else {
      // Generate new amount
      let amount = (Math.random().toFixed(4) * 100000000).toFixed(0)
      // Store it in user document
      foundUser.resetPasswordAmount = amount

      // Save the user document
      foundUser.save(function (err, updatedUser) {
        if (err) {
          res.status(422).json({
            error: 'Error saving user to DB.'
          })
          return next(err)
        }
        res.status(200).json({
          amount: amount,
          address: config.address
        })
      })
    }
  })
}

// ----------------------
// Init reset password
// ----------------------
const initResetPassword = function (req, res, next) {
  let delegate = req.body.delegate
  let amount = (Math.random().toFixed(4) * 100000000).toFixed(0)
  console.log(delegate)
  User.findOne({
    delegate: delegate
  }, function (err, foundUser) {
    if (err) {
      res.status(422).json({
        error: 'User not found'
      })
    }
    /* NOW HAVE TO UPDATE THE AMOUNT THAT HAS TO BE VERIFIED */
    // save the bear
    foundUser.confirmAmount = amount
    foundUser.save(function (err, newUser) {
      if (err) {
        return next(err)
      }
      res.status(201).json({
        success: true
      })
    })

    /* THEN REDIRECT TO THE RESETPASSWORD PAGE */
  })
}

// --------------------
// Reset password route
// --------------------
const resetPassword = function (req, res, next) {
  let txId = req.body.txId
  let delegate = req.body.delegate
  let password = req.body.password

  // Get delegate
  User.findOne({
    delegate: delegate
  }, function (err, foundUser) {
    if (err) {
      res.status(422).json({
        error: 'No user was found.'
      })
      return next(err)
    }

    // If userAmount was already generated
    if (foundUser.resetPasswordAmount) {
      // Check tx in blockchain
      blockchain.checkConfirmation(foundUser.profile.forge, config.address, txId, foundUser.resetPasswordAmount, function (err, confirmed) {
        if (err) {
          res.status(500).json({
            error: 'An error occured trying to verify tx.'
          })
          return next(err)
        } else {
          // If tx received
          if (confirmed) {
            foundUser.password = password
            foundUser.save(function (err, newUser) {
              if (err) {
                return next(err)
              }
              return res.status(200).send()
            })
          } else {
            // res the amount to send stored in DB
            res.status(422).json({
              success: false
            })
          }
        }
      })

      // If userAmount wasn't already generated
    } else {
      res.status(200).json({
        error: 'You first need to generate amount. See the API docs for more informations.'
      })
    }
  })
}

// ----------------------
// Get forged Lisk route
// ----------------------
const getForgedLisks = function (req, res, next) {
  let publicKey = req.query.publicKey

  blockchain.getForgedLisksUser(publicKey, function (err, total) {
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

module.exports = {
  register,
  login,
  initResetPassword,
  resetPassword,
  getAllUsers,
  getUser,
  confirmAmount,
  resetPasswordAmount,
  getForgedLisks,
  generateToken,
  roleAuthorization
}
