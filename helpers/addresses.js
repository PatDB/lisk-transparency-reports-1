const user = require('../models/User')
const blockchain = require('./blockchain')
const config = require('../config/main')

// --------------------
// Add address route
// --------------------
const add = function (req, res, next) {
  let address = req.body.address
  let category = req.body.category
  let amount = (Math.random().toFixed(4) * 100000000).toFixed(0)

  user.findById(req.user._id, function (err, foundUser) {
    if (err) {
      res.status(422).json({
        error: 'No user was found.'
      })
      return next(err)
    } else {
      foundUser.profile.addresses.push({
        address: address,
        category: category,
        confirmAmount: amount
      })

      foundUser.save(function (err, updateduser) {
        if (err) {
          res.status(422).json({
            error: 'Error saving user to DB.'
          })
          return next(err)
        }
        res.status(200).json({
          success: true
        })
      })
    }
  })
}

// ---------------------
// Confirm address route
// ---------------------
const confirm = function (req, res, next) {
  let txId = req.body.txId
  let addressFound = false
  let address = []
  let pos

  // Get user
  user.findById(req.user._id, function (err, foundUser) {
    if (err) {
      res.status(422).json({
        error: 'No user was found.'
      })
      return next(err)
    }

    // Check if address is present in user profile
    for (let i = 0; i < foundUser.profile.addresses.length; i++) {
      if (foundUser.profile.addresses[i].address === req.body.address) {
        address = foundUser.profile.addresses[i]
        pos = i
        addressFound = true
      }
    }

    // If address is present in user profile
    if (addressFound) {
      // If address is not confirmed
      if (!address.confirmed) {
        // Check tx in blockchain
        if (txId) {
          blockchain.checkConfirmation(address.address, config.address, txId, address.confirmAmount, function (err, confirmed) {
            if (err) {
              res.status(422).json({
                error: 'An error occured trying to verify tx.'
              })
            } else {
              // If tx received
              if (confirmed) {
                // Mark user document as confirmed
                foundUser.profile.addresses[pos].confirmed = true
                // Save the user document
                foundUser.save(function (err, updateduser) {
                  if (err) {
                    res.status(422).json({
                      error: 'Error saving user to DB.'
                    })
                    return next(err)
                  }
                  res.status(200).json({
                    address: address.address,
                    confirmed: true
                  })
                })
              } else {
                res.status(200).json({
                  confirmed: false,
                  amount: address.confirmAmount,
                  address: config.address
                })
              }
            }
          })
        } else {
          res.status(200).json({
            confirmed: false,
            amount: address.confirmAmount,
            address: config.address
          })
        }
      } else {
        res.status(200).json({
          address: address.address,
          confirmed: true
        })
      }
    } else {
      res.status(422).json({
        error: 'Address not found in your profile.'
      })
    }
  })
}

// --------------------
// Remove address route
// --------------------
const remove = function (req, res, next) {
  let removed

  // Get user
  user.findById(req.user._id, function (err, foundUser) {
    if (err) {
      res.status(422).json({
        error: 'No user was found.'
      })
      return next(err)
    }

    // Check if address is present in user profile
    for (let i = 0; i < foundUser.profile.addresses.length; i++) {
      if (foundUser.profile.addresses[i].address === req.body.address) {
        foundUser.profile.addresses[i].remove()
        removed = 1
      }
    }

    // If address is present in user profile
    if (removed) {
      foundUser.save(function (err, updateduser) {
        if (err) {
          res.status(422).json({
            error: 'Error saving user to DB.'
          })
          return next(err)
        }
        res.status(200).json({
          address: req.body.address,
          removed: true
        })
      })
    } else {
      res.status(422).json({
        error: 'Address not found in your profile.'
      })
    }
  })
}

const getAddresses = function (req, res, next) {
  let delegate = req.query.delegate

  user.findOne({ delegate: delegate }, function (err, delegate) {
    if (err) {
      res.status(422).json({
        error: 'Can\'t find this user'
      })
      return next(err)
    }
    res.status(200).json(
      delegate.profile.addresses
    )
  })
}
module.exports = {
  add,
  confirm,
  remove,
  getAddresses
}
