var blockchain = require('./helpers/blockchain');

blockchain.getTxFromTo("9120485202270553493L", "7023069056644097238L", function (err, data) {
    if (err) {
        return(err);
    } else {
        console.log(data);
    }
});

blockchain.getBalance("9120485202270553493L", function (err, data) {
    if (err) {
        return(err);
    } else {
        console.log(data);
    }
});

blockchain.getAccount("9120485202270553493L", function (err, data) {
    if (err) {
        return(err);
    } else {
        console.log(data);
    }
});