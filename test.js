var blockchain = require('./helpers/blockchain');

blockchain.getOuterTx("9120485202270553493L", function (err, data) {
    if (err) {
        return(err);
    } else {
        console.log(data);
    }
});