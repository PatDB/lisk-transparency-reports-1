const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AddressSchema = new Schema({
  _owner: {
    type: String,
    required: true,
    ref: 'User'
  },
  address: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Forge', 'Holding', 'Donations', 'Personal', 'Servers', 'Unknown', 'Marketing']
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  confirmAmount: {
    type: Number
  }
})

module.exports = mongoose.model('Address', AddressSchema)
