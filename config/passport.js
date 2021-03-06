const passport = require('passport')
const User = require('../models/User')
const config = require('./main')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local').Strategy

const localOptions = {
  usernameField: 'delegate'
}

// Setting up local login strategy
const localLogin = new LocalStrategy(localOptions, function (delegate, password, done) {
  User.findOne({
    delegate: delegate
  }, function (err, user) {
    if (err) {
      return done(err)
    }
    if (!user) {
      return done(null, false, {
        error: 'Your login details could not be verified. Please try again.'
      })
    }

    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        return done(err)
      }
      if (!isMatch) {
        return done(null, false, {
          error: 'Your login details could not be verified. Please try again.'
        })
      } else {
        return done(null, user)
      }
    })
  })
})

const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  // Telling Passport where to find the secret
  secretOrKey: config.secret
}

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  User.findById(payload._id, function (err, user) {
    if (err) {
      return done(err, false)
    }

    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  })
})

passport.use(localLogin)
passport.use(jwtLogin)
