var module = require('helpers/transactions');

module.getOuterTx("9120485202270553493L", function (err, data) {
    if (err) {
        return(err);
    } else {
        console.log(data);
    }
});