const user = require('../models/User')
const blockchain = require('./blockchain')
const config = require('../config/main')

// --------------------
// Get addresses route
// --------------------
const get = function (req, res, next) {
  let toReturnAddr = []

  user.findOne({
    delegate: req.query.delegate
  }, function (err, delegate) {
    if (err) {
      return next({
        status: 500,
        message: err
      })
    }
    if (!delegate) {
      return next({
        status: 422,
        message: 'Can\'t find this delegate'
      })
    }
    if (req.query.address) {
      delegate.profile.addresses.forEach(function (address) {
        if (address.address === req.query.address) {
          toReturnAddr.push(address)
        }
      }, this)
    }
    if (req.query.category) {
      delegate.profile.addresses.forEach(function (address) {
        if (address.category === req.query.category) {
          toReturnAddr.push(address)
        }
      }, this)
    }
    if (!req.query.address && !req.query.category) {
      toReturnAddr = delegate.profile.addresses
    }
    res.status(200).json(
      toReturnAddr
    )
  })
}

// --------------------
// Add address route
// --------------------
const add = function (req, res, next) {
  let address = req.body.address
  let category = req.body.category
  let amount = (Math.random().toFixed(4) * 100000000).toFixed(0)

  user.findById(req.user._id, function (err, foundUser) {
    if (err) {
      return next({
        status: 500,
        message: err
      })
    }
    if (!foundUser) {
      return next({
        status: 422,
        message: 'Can\'t find this delegate'
      })
    } else {
      foundUser.profile.addresses.push({
        address: address,
        category: category,
        confirmAmount: amount
      })

      foundUser.save(function (err, updatedUser) {
        if (err) {
          return next({
            status: 500,
            message: err
          })
        }
        if (!updatedUser) {
          return next({
            status: 422,
            message: 'Error saving user to DB.'
          })
        }
        res.status(201).json({
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
  let address, pos
  let txId = req.body.txId
  let addressFound = false

  // Get user
  user.findById(req.user._id, function (err, foundUser) {
    if (err) {
      return next({
        status: 500,
        message: err
      })
    }
    if (foundUser) {
      return next({
        status: 422,
        message: 'Can\'t find this delegate'
      })
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
              return next({
                status: 500,
                message: err
              })
            } else {
              // If tx received
              if (confirmed) {
                // Mark user document as confirmed
                foundUser.profile.addresses[pos].confirmed = true
                // Save the user document
                foundUser.save(function (err, updateduser) {
                  if (err) {
                    return next({
                      status: 500,
                      message: 'Error saving user to DB.'
                    })
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
      return next({
        status: 422,
        message: 'Address not found for given delegate.'
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
      return next({
        status: 422,
        message: 'Can\'t find this delegate'
      })
    }

    // Check if address is present in user profile
    for (let i = 0; i < foundUser.profile.addresses.length; i++) {
      if (foundUser.profile.addresses[i].address === req.body.address) {
        foundUser.profile.addresses[i].remove()
        removed = 1
      }
    }

    // If address is removed from local document, save it
    if (removed) {
      foundUser.save(function (err, updateduser) {
        if (err) {
          return next({
            status: 500,
            message: 'Error saving user to DB.'
          })
        }
        res.status(200).json({
          address: req.body.address,
          removed: true
        })
      })
    } else {
      return next({
        status: 422,
        message: 'Address not found for given delegate.'
      })
    }
  })
}

module.exports = {
  add,
  confirm,
  remove,
  get
}
