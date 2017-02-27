const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema
const Usermodel = require('./User.js')
//const mongoosePaginate = require('mongoose-paginate')

//typetx schema
const typeTxSchema = new Schema({
  typetx: {
    type: String,
    required: true
  },
  confirmed: {
    type: Boolean,
    required: true,
    default: true
  },
  ordertx: {
    type: Number
  }
})

// Transaction schema
const TransactionSchema = new Schema({
  address: {
    type: String,
     lowercase: true,
    required: true
  },
  
  idTx: {
    type: Number,
    unique: true,
    required: true
  },
  
  typeTx: [typeTxSchema] ,//set default?
  
  insDate: {
    type: Date,
    default: Date.Now,//date of definition or date of insert?
    required: true
  }
}, 
{
  timestamps: true
})

module.exports = mongoose.model('Transaction', TransactionSchema)