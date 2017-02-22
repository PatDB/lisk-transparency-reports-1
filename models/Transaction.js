const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Usermodel = require('./User.js');
var ItemUser = mongoose.model('User');


//tytx schema
const typeTxSchema = new Schema({
  typetx: {
    type: String,
    required: true
  },
  active: {
    type: boolean,
    required: true,
    default: 1
  },
  order: {
    type: number,
    required: true
  },
})

// Transaction schema
const Schema = new Schema({
  address: {
    type: ObjectId,
    ref: 'AddressSchema' ,
    lowercase: true,
    required: true
  },
  
  idTx: {
    type: number,
    unique: true,
    required: true
  },
  
  typeTx: {
    type: ObjectId,
    ref: 'typeTxSchema' ,//set default?
    
  },
 
  insDate: {
    type: Date
    default: Date.now,//date of definition or date of insert?
    required: true
  }
}, {
  timestamps: true
})




module.exports = mongoose.model('Transaction', TransactionSchema)
