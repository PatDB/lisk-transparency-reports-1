var request = require('request')
var api = require('../config/main').api

/**
 * Return account details for a given address
 * https://lisk.io/documentation?i=lisk-docs/APIReference#get-account
 *
 * @param    {String} address
 * @callback {Object}
 */
var getAccount = function (address, callback) {
  var data = {
    address: address
  }

  request.get({
    url: api + '/accounts',
    qs: data,
    json: true
  }, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      if (body.success) {
        callback(null, body.account)
      } else {
        callback({
          success: false
        })
      }
    } else {
      callback(new Error('Error contacting API !'))
    }
  })
}

/**
 * Return delegate for a given username
 * https://lisk.io/documentation?i=lisk-docs/APIReference#get-delegate
 *
 * @param    {String} username
 * @callback {String}
 */
var getDelegate = function (username, callback) {
  var data = {
    username: username
  }
  console.log(username)
  request.get({
    url: api + '/delegates/get',
    qs: data,
    json: true
  }, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      if (body.success) {
        callback(null, body.delegate)
      } else {
        callback(new Error('API returned success = false !'))
      }
    } else {
      callback(new Error('Error contacting API !'))
    }
  })
}

/**
 * Return outward transactions for a given address
 * https://lisk.io/documentation?i=lisk-docs/APIReference#get-list-of-transactions
 *
 * @param    {String} senderId
 * @callback {Array}
 */
var getOutTxs = function (senderId, callback) {
  var data = {
    senderId: senderId,
    orderBy: 'timestamp:desc',
    limit: 100
  }

  request.get({
    url: api + '/transactions',
    qs: data,
    json: true
  }, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      if (body.success) {
        callback(null, body.transactions)
      } else {
        callback(new Error('API returned success = false !'))
      }
    } else {
      callback(new Error('Error contacting API !'))
    }
  })
}

/**
 * Return transactions from one address to another [{id, amount}]
 *
 * @param    {String} senderId
 * @param    {String} recipientId
 * @callback {Array}
 */
var getTxsFromTo = function (senderId, recipientId, callback) {
  var result = []

  getOutTxs(senderId, function (err, data) {
    if (err) {
      callback(err)
    } else {
      data.forEach(function (tx) {
        if (tx.recipientId === recipientId) {
          result.push({
            txId: tx.id,
            amount: tx.amount
          })
        }
      }, this)
      callback(null, result)
    }
  })
}

/**
 * Check transaction for account verification
 *
 * @param    {String} senderId
 * @param    {String} recipientId
 * @param    {String} txId
 * @param    {Number} amount
 * @callback {Boolean}
 */
var checkConfirmation = function (senderId, recipientId, txId, amount, callback) {
  var data = {
    id: txId
  }

  request.get({
    url: api + '/transactions/get',
    qs: data,
    json: true
  }, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      if (body.success) {
        let tx = body.transaction
        if (tx.senderId === senderId && tx.recipientId === recipientId && tx.amount === amount) {
          callback(null, true)
        } else {
          callback(null, false)
        }
      } else {
        callback(new Error('API returned success = false !'))
      }
    } else {
      callback(new Error('Error contacting API !'))
    }
  })
}

/**
 * Return total amount from array of transactions
 *
 * @param    {Array} transactions
 * @callback {Number}
 */
var getTxsAmount = function (transactions, callback) {
  var result = 0

  transactions.forEach(function (tx) {
    result += tx.amount
  }, this)

  callback(result)
}

/**
 * Return transfered amount from one address to another
 *
 * @param    {String} senderId
 * @param    {String} recipientId
 * @callback {Number}
 */
var getAmountFromTo = function (senderId, recipientId, callback) {
  getTxsFromTo(senderId, recipientId, function (err, data) {
    if (err) {
      callback(err)
    } else {
      getTxsAmount(data, function (amount) {
        callback(null, amount)
      })
    }
  })
}

/**
 * Return balance for a given address
 *
 * @param    {String} address
 * @callback {Number}
 */
var getBalance = function (address, callback) {
  var data = {
    address: address
  }

  request.get({
    url: api + '/accounts/getBalance',
    qs: data,
    json: true
  }, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      if (body.success) {
        callback(null, body.balance)
      } else {
        callback(new Error('API returned success = false !'))
      }
    } else {
      callback(new Error('Error contacting API !'))
    }
  })
}

/**
 * Return total lisk forged for a given public key
 *
 */
var getForgedLisksUser = function (generatorPublicKey, callback) {
  var data = {
    generatorPublicKey: generatorPublicKey
  }
  request.get({
    url: api + '/delegates/forging/getForgedByAccount',
    qs: data,
    json: true
  }, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      if (body.success) {
        callback(null, body)
      } else {
        callback(new Error('API returned success = false !'))
      }
    } else {
      callback(new Error('Error contacting API !'))
    }
  })
}

module.exports = {
  getAccount,
  getTxsFromTo,
  getAmountFromTo,
  getBalance,
  getDelegate,
  checkConfirmation,
  getForgedLisksUser
}
