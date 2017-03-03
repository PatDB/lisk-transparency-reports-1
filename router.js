const express = require('express')
const passport = require('passport')
const passportConfig = require('./config/passport')

const AuthHelper = require('./helpers/auth')
const AddrHelper = require('./helpers/addresses')
const DelegateHelper = require('./helpers/delegates')

// Middlewares to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false })
const requireLogin = passport.authenticate('local', { session: false })

module.exports = function (app) {
  // Initialize route groups
  const apiRoutes = express.Router()
  const authRoutes = express.Router()
  const delegatesRoutes = express.Router()
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

  // Return amount to send
  authRoutes.get('/resetPasswordAmount', AuthHelper.resetPasswordAmount)

  // Init the password reseting process
  authRoutes.post('/initResetPassword', AuthHelper.initResetPassword)

  // Reset password
  authRoutes.post('/resetPassword', AuthHelper.resetPassword)

  // ==========================
  // Delegates Routes
  // ==========================
  apiRoutes.use('/delegates', delegatesRoutes)

  // Get all active delegates from the DB
  delegatesRoutes.get('/getDelegates', DelegateHelper.getDelegates)

  // Get a particular delegate informations from the lisk API
  delegatesRoutes.get('/getDelegate', DelegateHelper.getUser)

  // Get the forged lisks amount from the lisk API
  delegatesRoutes.get('/getForged', DelegateHelper.getForged)

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

  // Set url for API group routes
  app.use('/api', apiRoutes)
  app.use('/', index)
}
