var request = require('request');
var api = require('../config').api;

/**
 * Return outward transactions [{id, recipientId, amount}] for a given address 
 *
 * @param    {String} senderId
 * @callback {Object}
 */
var getOutTx = function (senderId, callback) {

    var result = [];

    data = {
        senderId: senderId,
        limit: "100"
    };

    request.get({
        url: api + "transactions",
        qs: data,
        json: true
    }, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            if (body.success) {
                body.transactions.forEach(function (tx) {
                    result.push({
                        txId: tx.id,
                        recipientId: tx.recipientId,
                        amount: tx.amount
                    });
                }, this);
                callback(null, result);
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
 * @callback {Object}
 */
var getTxFromTo = function (senderId, recipientId, callback) {

    var result = [];

    data = {
        senderId: senderId,
        recipientId: recipientId,
        limit: "100"
    };

    request.get({
        url: api + "transactions",
        qs: data,
        json: true
    }, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            if (body.success) {
                body.transactions.forEach(function (tx) {
                    result.push({
                        txId: tx.id,
                        amount: tx.amount
                    });
                }, this);
                callback(null, result);
            } else {
                callback(new Error("API returned success = false !"));
            }
        } else {
            callback(new Error("Error contacting API !"));
        }
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
        url: api + "accounts/getBalance",
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
    getOutTx: getOutTx,
    getTxFromTo: getTxFromTo,
    getBalance: getBalance
};