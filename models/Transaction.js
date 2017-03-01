const mongoose = require('mongoose')
const Schema = mongoose.Schema

//const mongoosePaginate = require('mongoose-paginate')

//typetx schema
const typeTxSchema = new Schema({
  
  typetx: {
    type: String,
    required: true
  },
  
  typeconfirmed: {
    type: Boolean,
    required: true,
    default: true
  },
  
  typeorder: {
    type: Number
  }

})



// Transaction schema
const TransactionSchema = new Schema({
  idTx: {
    type: Number,
    unique: true,
    required: true
  },
  
  txSender: {
    _delegate: [{ type: Schema.Types.ObjectId, ref: 'User' ,require = true}], // Join
    _address: [{ type: Schema.Types.ObjectId, ref: 'Address' , require = true }] // Join
  },
  
  txRecipient: {
    delegate: String,//If existing in DB, else check blockchain
    address: String // Just text, no join
  },
  
  txAmount: {
    type: Number,
    required: true
  },
  
  typeTx: [typeTxSchema] ,//set default?
  
  txInsDate: {
    type: Date,
    default: Date.Now,//date of definition or date of insert?
    required: true
  }
}, 
{
  timestamps: true
}
       
)


module.exports = mongoose.model('Transaction', TransactionSchema)