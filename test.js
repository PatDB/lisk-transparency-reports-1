var blockchain = require('./helpers/blockchain');
var from = "9120485202270553493L";
var to = "7023069056644097238L";

blockchain.getTxsFromTo(from, to, function (err, data) {
    if (err) {
        return (err);
    } else {
        console.log("\ngetTxsFromTo() :");
        console.log(data);
    }
});

blockchain.getBalance(from, function (err, data) {
    if (err) {
        return (err);
    } else {
        console.log("\ngetBalance() : \n" + data);
    }
});

blockchain.getAccount(from, function (err, data) {
    if (err) {
        return (err);
    } else {
        console.log("\ngetAccount() :");
        console.log(data);
    }
});

blockchain.getAmountFromTo(from, to, function (err, data) {
    if (err) {
        return (err);
    } else {
        console.log("\ngetAmountFromTo() : \n" + data);
    }
});