const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Address = require('../models/Address')
const blockchain = require('./blockchain')
const config = require('../config/main')

// --------------------
// Get addresses route
// --------------------
const get = function (req, res, next) {
  let toReturnAddr = []
  let delegate = req.query.delegate

  User.findOne({
    delegate: delegate
  }).populate('addresses').exec(function (err, delegate) {
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
      delegate.addresses.forEach(function (address) {
        if (address.address === req.query.address) {
          toReturnAddr.push(address)
        }
      }, this)
    }
    if (req.query.category) {
      delegate.addresses.forEach(function (address) {
        if (address.category === req.query.category) {
          toReturnAddr.push(address)
        }
      }, this)
    }
    if (!req.query.address && !req.query.category) {
      toReturnAddr = delegate.addresses
    }

    if (req.headers.authorization) {
      let encoded = req.headers.authorization.substr(4)
      jwt.verify(encoded, config.secret, function (err, decoded) {
        if (err) {
          return next({
            status: 500,
            message: err
          })
        }
        User.findById(decoded._id, function (err, asker) {
          if (err) {
            return next({
              status: 500,
              message: err
            })
          }
          if (asker.delegate === delegate.delegate) {
            res.status(200).json(
              toReturnAddr
            )
          } else {
            let finalAddr = []
            toReturnAddr.forEach(function (address) {
              if (address.confirmed) {
                finalAddr.push(address)
              }
            }, this)
            res.status(200).json(
              finalAddr
            )
          }
        })
      })
    } else {
      let finalAddr = []
      toReturnAddr.forEach(function (address) {
        if (address.confirmed) {
          finalAddr.push(address)
        }
      }, this)
      res.status(200).json(
        finalAddr
      )
    }
  })
}

// --------------------
// Add address route
// --------------------
const add = function (req, res, next) {
  let address = req.body.address
  let category = req.body.category
  let amount = (Math.random().toFixed(4) * 100000000).toFixed(0)

  if (category === 'Forge') {
    return next({
      status: 422,
      message: 'You can\'t add more than one forge address'
    })
  }

  User.findById(req.user._id, function (err, foundUser) {
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
    }
    if (!foundUser.confirmed) {
      return next({
        status: 422,
        message: 'You first need to verify your forge address'
      })
    }

    let newAddress = new Address({
      _owner: foundUser.delegate,
      address: address,
      category: category,
      confirmAmount: amount
    })

    newAddress.save(function (err, savedAddress) {
      if (err) {
        return next({
          status: 500,
          message: err
        })
      }
      if (!savedAddress) {
        return next({
          status: 422,
          message: 'Error saving user to DB.'
        })
      }
      foundUser.addresses.push(savedAddress)
      foundUser.save(function (err) {
        if (err) {
          return next({
            status: 500,
            message: err
          })
        }
        res.status(201).json({
          success: true
        })
      })
    })
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
  User.findById(req.user._id).populate('addresses').exec(function (err, foundUser) {
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
    }

    // Check if address is present in user profile
    for (let i = 0; i < foundUser.addresses.length; i++) {
      if (foundUser.addresses[i].address === req.body.address) {
        address = foundUser.addresses[i]
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
                status: 422,
                message: err
              })
            } else {
              // If tx received
              if (confirmed) {
                // Mark user document as confirmed
                foundUser.addresses[pos].confirmed = true
                if (foundUser.addresses[pos].category === 'Forge') {
                  foundUser.confirmed = true
                }
                // Save the user document
                foundUser.save(function (err, updateduser) {
                  if (err) {
                    return next({
                      status: 500,
                      message: 'Error saving user to DB.'
                    })
                  }

                  foundUser.addresses[pos].save(function (err) {
                    if (err) {
                      return next({
                        status: 500,
                        message: 'Error saving address to DB.'
                      })
                    }
                  })

                  res.status(200).json({
                    address: address.address,
                    confirmed: true
                  })
                })
              } else {
                res.status(200).json({
                  confirmed: false,
                  amount: address.confirmAmount
                })
              }
            }
          })
        } else {
          res.status(200).json({
            confirmed: false,
            amount: address.confirmAmount
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
  let removed, forge

  // Get user
  User.findById(req.user._id).populate('addresses').exec(function (err, foundUser) {
    if (err) {
      return next({
        status: 422,
        message: 'Can\'t find this delegate'
      })
    }

    // Check if address is present in user profile
    for (let i = 0; i < foundUser.addresses.length; i++) {
      if (foundUser.addresses[i].address === req.body.address) {
        if (foundUser.addresses[i].category !== 'Forge') {
          foundUser.addresses[i].remove()
          removed = 1
        } else {
          forge = 1
        }
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
    } else if (forge) {
      return next({
        status: 422,
        message: 'You can\'t remove your forge address.'
      })
    } else {
      return next({
        status: 422,
        message: 'Address not found for given delegate.'
      })
    }
  })
}

// -------------------------
// Get address to send route
// -------------------------
const getToSendAddress = function (req, res, next) {
  res.status(200).json(
    config.address
  )
}

module.exports = {
  get, // ok
  add, // ok
  confirm, // ok
  remove, // ok
  getToSendAddress
}
