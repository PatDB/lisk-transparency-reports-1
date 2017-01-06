var request = require('request');

/**
 * Return outer transactions [{id, recipientId, amount}] for a given address 
 *
 * @param    {String} address
 * @callback {Object}
 */
var getOuterTx = function (address, callback) {

    result = [];

    data = {
        senderId: address,
        limit: "100"
    };

    request.get({
        url: "https://login.lisk.io/api/transactions",
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

module.exports = {
    getOuterTx: getOuterTx
};