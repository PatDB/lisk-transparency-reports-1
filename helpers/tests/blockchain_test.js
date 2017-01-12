let blockchain = require('../blockchain')
let config = require('../../config/main')
let delegate = 'sherlockstd'
let from = '9120485202270553493L'
let to = '7023069056644097238L'
let address = config.address

blockchain.getTxsFromTo(from, to, function (err, data) {
  console.log('\ngetTxsFromTo() : \n')
  if (err) {
    console.log(err)
  } else {
    console.log(data)
  }
})

blockchain.getBalance(from, function (err, data) {
  console.log('\ngetBalance() : \n')
  if (err) {
    console.log(err)
  } else {
    console.log(data)
  }
})

blockchain.getAccount(from, function (err, data) {
  console.log('\ngetAccount() : \n')
  if (err) {
    console.log(err)
  } else {
    console.log(data)
  }
})

blockchain.getAmountFromTo(from, to, function (err, data) {
  console.log('\ngetAmountFromTo() : \n')
  if (err) {
    console.log(err)
  } else {
    console.log(data)
  }
})

blockchain.getDelegate(delegate, function (err, data) {
  console.log('\ngetAddress() : \n')
  if (err) {
    console.log(err)
  } else {
    console.log(data)
  }
})

blockchain.checkConfirmation(from, address, '12831626967363815821', 31530000, function (err, data) {
  console.log('\ncheckConfirmation() : \n')
  if (err) {
    console.log(err)
  } else {
    console.log(data)
  }
})
