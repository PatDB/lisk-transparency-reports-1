app.factory('AuthFactory', function ($http, $sessionStorage) {
  function Login (delegate, password, callback) {
    $http.post('/api/auth/login', {
      delegate: delegate.toLowerCase(),
      password: password
    })
      .then(function (res) {
        // login successful if server return code 200
        if (res.status === 200) {
          // execute callback with code 200 to indicate successful login
          callback(res)

          // store username and token in local storage to keep user logged in between page refreshes
          $sessionStorage.currentUser = {
            delegate: delegate,
            token: res.data.token
          }

          $http.defaults.headers.common.Authorization = res.data.token
        } else {
          // execute callback to indicate failed login
          callback(res)
        }
      }).catch(function (e) {
        callback(e)
      })
  }

  function Register (delegate, password, callback) {
    $http.post('/api/auth/register', {
      delegate: delegate.toLowerCase(),
      password: password
    })
      .then(function (res) {
        // register successful
        if (res.status === 200) {
          callback(res.status)

          $sessionStorage.currentUser = {
            delegate: delegate,
            token: res.data.token
          }

          $http.defaults.headers.common.Authorization = res.data.token
        } else {
          callback(res)
        }
      }).catch(function (e) {
        callback(e)
      })
  }

  function Amount (callback) {
    $http.get('/api/auth/amount')
      .then(function (res) {
        // register successful
        if (res.status === 200) {
          callback(res.data)
        } else {
          callback(res.status)
        }
      }).catch(function (e) {
        callback(e)
      })
  }

  function Confirm (txId, callback) {
    $http.post('/api/auth/confirm', {
      txId: txId
    })
      .then(function (res) {
        // register successful
        if (res.status === 200) {
          callback(null, res.data)
        } else {
          callback(res.status)
        }
      }).catch(function (e) {
        callback(e)
      })
  }

  function Logout () {
    // remove user from local storage and clear http auth header
    delete $sessionStorage.currentUser
    $http.defaults.headers.common.Authorization = ''
  }

  function Token (callback) {
    // return the JWT
    callback($sessionStorage.currentUser.token)
  }

  return {
    Register,
    Login,
    Amount,
    Confirm,
    Logout,
    Token
  }
})
