const express = require('express')
const passport = require('passport')
const passportConfig = require('./config/passport')

const AuthHelper = require('./helpers/auth')
const ReportHelper = require('./helpers/blockchain')
const AddrHelper = require('./helpers/addresses')

// Middlewares to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false })
const requireLogin = passport.authenticate('local', { session: false })

module.exports = function (app) {
  // Initialize route groups
  const apiRoutes = express.Router()
  const authRoutes = express.Router()
  const reportRoutes = express.Router()
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

  // Generate aleatory amount to send route
  authRoutes.get('/amount', requireAuth, AuthHelper.amount)

  // Verify transaction route
  authRoutes.post('/confirm', requireAuth, AuthHelper.confirm)

  // Route to get all active delegates
  authRoutes.get('/test1', AuthHelper.getAllUsers)

  authRoutes.get('/getDelegate', AuthHelper.getUser)
  // ==========================
  // Addresses Routes
  // ==========================
  apiRoutes.use('/addresses', addrRoutes)

  // Generate aleatory amount to send route
  addrRoutes.post('/add', requireAuth, AddrHelper.add)

  // Verify transaction route
  addrRoutes.post('/confirm', requireAuth, AddrHelper.confirm)

  // Delete address route
  addrRoutes.delete('/remove', requireAuth, AddrHelper.remove)

  // ==========================
  // Report Routes
  // ==========================

  

  // Set url for API group routes
  app.use('/api', apiRoutes)
  app.use('/', index)
}
