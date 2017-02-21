const express = require('express')
const passport = require('passport')
const passportConfig = require('./config/passport')

const AuthHelper = require('./helpers/auth')
const AddrHelper = require('./helpers/addresses')

// Middlewares to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false })
const requireLogin = passport.authenticate('local', { session: false })

module.exports = function (app) {
  // Initialize route groups
  const apiRoutes = express.Router()
  const authRoutes = express.Router()
  const addrRoutes = express.Router()
  const index = require('./routes/index')

  // ==========================
  // Auth Routes
  // ==========================
  apiRoutes.use('/auth', authRoutes)

  // Registration route
  authRoutes.post('/register', AuthHelper.register)

  // Login route
  authRoutes.post('/login', requireLogin, AuthHelper.login)

  // Generate / return aleatory amount to send route
  authRoutes.get('/amount', requireAuth, AuthHelper.confirmAmount)

  // Return amount to send
  authRoutes.get('/resetPasswordAmount', AuthHelper.resetPasswordAmount)

  // Get all active delegates from the DB
  authRoutes.get('/getDelegates', AuthHelper.getAllUsers)

  // Get a particular delegate informations from the lisk API
  authRoutes.get('/getDelegate', AuthHelper.getUser)

  // Get the forged lisks amount from the lisk API
  authRoutes.get('/getForgedLisks', AuthHelper.getForgedLisks)

  // Init the password reseting process
  authRoutes.post('/initResetPassword', AuthHelper.initResetPassword)

  // Reset password
  authRoutes.post('/resetPassword', AuthHelper.resetPassword)

  // ==========================
  // Addresses Routes
  // ==========================
  apiRoutes.use('/addresses', addrRoutes)

  // Generate aleatory amount to send route
  addrRoutes.post('/', requireAuth, AddrHelper.add)

  // Verify transaction route
  addrRoutes.put('/', requireAuth, AddrHelper.confirm)

  // Delete address route
  addrRoutes.delete('/', requireAuth, AddrHelper.remove)

  // Get addresses of a user
  addrRoutes.get('/', AddrHelper.get)

  // Get address to send tx
  addrRoutes.get('/getToSendAddress', AddrHelper.getToSendAddress)

  // ==========================
  // Report Routes
  // ==========================

  // Set url for API group routes
  app.use('/api', apiRoutes)
  app.use('/', index)
}
