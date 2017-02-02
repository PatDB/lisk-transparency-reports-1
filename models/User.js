const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const AddressSchema = new Schema({
  address: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Holding', 'Donations', 'Personal', 'Servers', 'Unknown']
  }
})

// User schema
const UserSchema = new Schema({
  delegate: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    forge: {
      type: String
    },
    addresses: [AddressSchema]
  },
  role: {
    type: String,
    enum: ['Delegate', 'Admin'],
    default: 'Delegate'
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  confirmAmount: {
    type: Number
  }
}, {
  timestamps: true
})

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function (next) {
  const user = this
  const saltRounds = 5

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

// Method to compare password for login
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return cb(err)
    }

    cb(null, isMatch)
  })
}

module.exports = mongoose.model('User', UserSchema)
