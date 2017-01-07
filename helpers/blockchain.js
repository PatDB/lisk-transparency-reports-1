var request = require('request');
var api = require('../config').api;


/**
 * Return account details for a given address
 * https://lisk.io/documentation?i=lisk-docs/APIReference#get-account
 *
 * @param    {String} address
 * @callback {Object}
 */
var getAccount = function (address, callback) {

    data = {
        address: address
    };

    request.get({
        url: api + "/accounts",
        qs: data,
        json: true
    }, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            if (body.success) {
                callback(null, body.account);
            } else {
                callback(new Error("API returned success = false !"));
            }
        } else {
            callback(new Error("Error contacting API !"));
        }
    });
};


/**
 * Return outward transactions for a given address
 * https://lisk.io/documentation?i=lisk-docs/APIReference#get-list-of-transactions
 *
 * @param    {String} senderId
 * @callback {Array}
 */
var getOutTx = function (senderId, callback) {

    var result = [];

    data = {
        senderId: senderId,
        limit: "100"
    };

    request.get({
        url: api + "/transactions",
        qs: data,
        json: true
    }, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            if (body.success) {
                callback(null, body.transactions);
            } else {
                callback(new Error("API returned success = false !"));
            }
        } else {
            callback(new Error("Error contacting API !"));
        }
    });
};


/**
 * Return transactions from one address to another [{id, amount}] 
 *
 * @param    {String} senderId
 * @param    {String} recipientId
 * @callback {Array}
 */
var getTxFromTo = function (senderId, recipientId, callback) {

    var result = [];

    getOutTx(senderId, function (err, data) {
        if (err) {
            callback(err);
        } else {
            data.forEach(function (tx) {
                if (tx.recipientId == recipientId) {
                    result.push({
                        txId: tx.id,
                        amount: tx.amount
                    });
                }
            }, this);
        }
        callback(null, result);
    });
};


/**
 * Return balance for a given address 
 *
 * @param    {String} address
 * @callback {Number}
 */
var getBalance = function (address, callback) {

    data = {
        address: address
    };

    request.get({
        url: api + "/accounts/getBalance",
        qs: data,
        json: true
    }, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            if (body.success) {
                callback(null, body.balance);
            } else {
                callback(new Error("API returned success = false !"));
            }
        } else {
            callback(new Error("Error contacting API !"));
        }
    });
};

module.exports = {
    getAccount: getAccount,
    getTxFromTo: getTxFromTo,
    getBalance: getBalance
};