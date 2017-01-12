const express = require('express')
const passport = require('passport')
const passportConfig = require('./config/passport')

const AuthHelper = require('./helpers/auth')

// Middlewares to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false })
const requireLogin = passport.authenticate('local', { session: false })

module.exports = function (app) {
  // Initialize route groups
  const apiRoutes = express.Router()
  const authRoutes = express.Router()
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
  authRoutes.post('/amount', requireAuth, AuthHelper.amount)

  // Verify transaction route
  authRoutes.post('/confirm', requireAuth, AuthHelper.confirm)

  // Set url for API group routes
  app.use('/api', apiRoutes)
  app.use('/', index)
}
