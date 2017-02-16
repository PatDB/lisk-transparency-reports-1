const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./config/main')
const router = require('./router')

// Use native Node promises
mongoose.Promise = global.Promise

// connect to MongoDB
mongoose.connect(config.mongo_url, function (err) {
  if (err) {
    console.log('\nError when try to connect to db', err)
  } else {
    console.log('\nConnection to db successful')
  }
})

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

router(app)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500).json(err.message || 'En errror occured.')
})

module.exports = app
