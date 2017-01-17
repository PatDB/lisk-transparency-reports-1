/*
lisk-transparency-reports v0.0.0
https://github.com/SherlockStd/lisk-transparency-reports
*/

var app = angular.module('app', ['ngRoute', 'ngResource', 'ngStorage', 'oitozero.ngSweetAlert'])

app.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.hashPrefix('')
}])

app.controller('IndexCtrl', ['$scope', '$location', 'AuthFactory', function ($scope, $location, AuthFactory) {
  AuthFactory.Token(function (token) {
    $scope.test = token
  })
}])

app.controller('AuthCtrl', ['$scope', '$location', '$sessionStorage', 'AuthFactory', 'SweetAlert', function ($scope, $location, $sessionStorage, AuthFactory, SweetAlert) {
  $scope.register = function () {
    if (!$scope.register.delegate || !$scope.register.password || !$scope.register.rpassword) {
      SweetAlert.swal('Error', 'Please fill all the fields', 'error')
      return
    }
    if ($scope.register.password !== $scope.register.rpassword) {
      SweetAlert.swal('Error', 'The passwords are not the same', 'error')
      return
    }
    AuthFactory.Register($scope.register.delegate, $scope.register.password, function (res) {
      if (res === 200) {
        $location.path('/verify')
      } else {
        SweetAlert.swal('Error', res.data.error, 'error')
      }
    })
  }

  $scope.login = function () {
    if (!$scope.login.delegate || !$scope.login.password) {
      SweetAlert.swal('Error', 'Please fill all the fields', 'error')
      return
    }
    AuthFactory.Login($scope.login.delegate, $scope.login.password, function (res) {
      if (res.status === 200) {
        if (res.data.confirmed) {
          $location.path('/')
        } else {
          $location.path('/verify')
        }
      } else {
        console.log(res)
        SweetAlert.swal('Error', res.data.error, 'error')
      }
    })
  }
}])

app.controller('SidebarCtrl', ['$scope', '$location', 'AuthFactory', function ($scope, $location, AuthFactory) {
  $scope.logout = function () {
    AuthFactory.Logout()
    $location.path('/auth')
  }

  $scope.go = function (path) {
    $location.path(path)
  }
}])

app.controller('VerifyCtrl', ['$scope', '$location', 'AuthFactory', '$sessionStorage', 'SweetAlert', function ($scope, $location, AuthFactory, $sessionStorage, SweetAlert) {
  AuthFactory.Amount(function (res) {
    $scope.test = res
  })

  console.log($sessionStorage.currentUser.confirmed)

  $scope.verify = function () {
    AuthFactory.Confirm($scope.txId, function (err, data) {
      if (err) {
        SweetAlert.swal('Error', 'Transaction not found.', 'error')
      } else {
        if (data.confirmed) {
          SweetAlert.swal({
            title: 'Account confirmed !',
            type: 'success'
          }, function () {
            $location.path('/')
            $sessionStorage.currentUser.confirmed = true
          })
        } else {
          SweetAlert.swal('Error', 'This transaction do not match above details.', 'error')
        }
      }
    })
  }
}])

app.run(['$rootScope', '$location', '$http', '$sessionStorage', function ($rootScope, $location, $http, $sessionStorage) {
  if (typeof $sessionStorage.currentUser !== 'undefined') {
    console.log(typeof $sessionStorage.currentUser.token)
    $http.defaults.headers.common.Authorization = $sessionStorage.currentUser.token
  }
  // register listener to watch route changes
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (!$sessionStorage.currentUser || !$sessionStorage.currentUser.token) {
      // no logged user, we should be going to #login
      if (next.templateUrl !== 'templates/auth.html') {
        // not going to #login, we should redirect now
        $location.path('/auth')
      }
    } else {
      if (next.templateUrl === 'templates/auth.html') {
        $location.path('/')
      }
    }
  })
}])

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'templates/index.html',
    controller: 'IndexCtrl'
  })
  .when('/auth', {
    templateUrl: 'templates/auth.html',
    controller: 'AuthCtrl'
  })
  .when('/verify', {
    templateUrl: 'templates/verify.html',
    controller: 'VerifyCtrl'
  })
}])

app.factory('AuthFactory', ['$http', '$sessionStorage', function ($http, $sessionStorage) {
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
}])
