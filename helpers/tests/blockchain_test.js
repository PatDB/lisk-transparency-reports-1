var blockchain = require('../blockchain');
var from = "9120485202270553493L";
var to = "7023069056644097238L";

blockchain.getTxsFromTo(from, to, function (err, data) {
    console.log("\ngetTxsFromTo() : \n");
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
});

blockchain.getBalance(from, function (err, data) {
    console.log("\ngetBalance() : \n");
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
});

blockchain.getAccount(from, function (err, data) {
    console.log("\ngetAccount() : \n");
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
});

blockchain.getAmountFromTo(from, to, function (err, data) {
    console.log("\ngetAmountFromTo() : \n");
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
});