const blockchain = require('../helpers/blockchain')

const User = require('../models/User')
const Address = require('../models/Address')
const Transaction = require('../models/Transaction')
const config = require('../config/main')

/**
 * Return Transaction for a given id
 *
 * @param    {String} request
 * @param    {String} result
 * @param    {String} 
 * @callback {String}
 */
const getTX = function (req, res, next) {
  let toReturnAddr = []
  let delegate = req.query.delegate
 // populate txSender_delegate ref
  User.findOne({
    delegate: delegate
  }).populate('txSender_delegate').exec(function (err, delegate) {
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
  // end populate txSender_delegate ref

// populate txSender_address ref
  Address.findOne({
    delegate: delegate
  }).populate('txSender_address').exec(function (err, delegate) {
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
  // end populate txSender_address ref

}



// --------------------
// defineTx
// --------------------
// to define type tx on personal desk
const defineTx = function (req, res, next) {
 
     // check user
     //search tx by idTX  
     // check auth user = address tX
     //insert or update 
   
  
}


// ----------------------
// Txbydelegate-Address
// ----------------------
// search on home
const TxByDelegate = function (req, res, next) {
  

 
}

// --------------------
// filterTxByType
// --------------------
// filter on personal desk
const filterTxByType = function (req, res, next) {
 
}

// ----------------------
// MybyAddresses
// ---------------------- 
// search on myreport
const MyByAddresses = function (req, res, next) {
  

 
}


module.exports = {
//getTx,
//defineTx,
//TxByDelegate,
//filterTxByType,
//MyByAddresses
}

