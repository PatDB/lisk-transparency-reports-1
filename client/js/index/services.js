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
        if (res.status === 201) {
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

  function initResetPassword (delegate, callback) {
    $http.post('/api/auth/initResetPassword', {
      delegate: delegate.toLowerCase()
    })
      .then(function (res) {
        console.log(res)
        if (res.status === 201 && res.data.success === true) {
          callback(true)
        } else {
          callback(false)
        }
      }).catch(function (e) {
        callback(e)
      })
  }

  function resetPassword (delegate, txId, password, callback) {
    $http.post('/api/auth/resetPassword', {
      delegate: delegate.toLowerCase(),
      txId: txId,
      password: password
    })
      .then(function (res) {
        console.log(res)
        if (res.status === 200) {
          callback(null, true)
        } else {
          callback(null, false)
        }
      }).catch(function (err) {
        callback(err)
      })
  }

  /* Function to get all delegates names from DB */
  function displayAll (callback) {
    $http.get('/api/auth/getDelegates')
      .then(function (res) {
        if (res.status === 200) {
          callback(res.data.allUsers)
        } else {
          callback(res.status)
        }
      }).catch(function (e) {
        callback(e)
      })
  }

  /* Function that'll extract all informations of a delegate from
  the Lisk API */
  function getUserh (username, callback) {
    $http({
      url: '/api/auth/getDelegate',
      method: 'GET',
      params: {
        username: username
      }
    })
      .then(function (res) {
        if (res.status === 200) {
          callback(res.data)
        } else {
          callback(res.status)
        }
      }).catch(function (e) {
        callback(e)
      })
  }

  function getTotalLisksForgedForUser (publicKey, callback) {
    $http({
      url: '/api/auth/getForgedLisks',
      method: 'GET',
      params: {
        publicKey: publicKey
      }
    })
      .then(function (res) {
        if (res.status === 200) {
          callback(res.data)
        } else {
          callback(res.status)
        }
      }).catch(function (e) {
        callback(e)
      })
  }

  function resetPasswordAmount (delegate, callback) {
    $http({
      url: '/api/auth/resetPasswordAmount',
      method: 'GET',
      params: {
        delegate: delegate
      }
    })
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
    initResetPassword,
    resetPassword,
    displayAll,
    getUserh,
    getTotalLisksForgedForUser,
    resetPasswordAmount,
    Logout,
    Token
  }
})

app.factory('AddressFactory', function ($http, $sessionStorage) {
  function Add (address, category, callback) {
    $http.post('/api/addresses', {
      address: address,
      category: category
    })
      .then(function (res) {
        console.log(res)
        if (res.status === 201) {
          callback(res)
        } else {
          callback(res)
        }
      }).catch(function (e) {
        callback(e)
      })
  }

  function getAddress (delegate, address, callback) {
    if (!address) {
      $http({
        url: '/api/addresses',
        method: 'GET',
        params: {
          delegate: delegate
        }
      })
        .then(function (res) {
          if (res.status === 200) {
            callback(res.data)
          } else {
            callback(res.status)
          }
        }).catch(function (e) {
          callback(e)
        })
    } else {
      $http({
        url: '/api/addresses',
        method: 'GET',
        params: {
          delegate: delegate,
          address: address
        }
      })
        .then(function (res) {
          if (res.status === 200) {
            callback(res.data)
          } else {
            callback(res.status)
          }
        }).catch(function (e) {
          callback(e)
        })
    }
  }

  function Confirm (address, txId, callback) {
    $http.put('/api/addresses', {
      address: address,
      txId: txId
    })
      .then(function (res) {
        console.log(res)
        // register successful
        if (res.status === 200) {
          callback(null, res.data)
        } else {
          callback(res.status)
        }
      }).catch(function (e) {
        callback(e)
        console.log(e)
      })
  }

  function getToSendAddress (callback) {
    $http({
      url: '/api/addresses/getToSendAddress',
      method: 'GET'
    })
        .then(function (res) {
          if (res.status === 200) {
            callback(res.data)
          } else {
            callback(res.status)
          }
        }).catch(function (e) {
          callback(e)
        })
  }

  return {
    Add,
    getAddress,
    Confirm,
    getToSendAddress
  }
})
