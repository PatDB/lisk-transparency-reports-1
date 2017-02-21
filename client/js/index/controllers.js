// ------------------
// Index Controller
// ------------------

app.controller('IndexCtrl', ['$scope', '$location', 'AuthFactory', function ($scope, $location, AuthFactory) {
  AuthFactory.Token(function (token) {
    $scope.test = token
  })
}])

// ------------------------
// Authentication Controller
// ------------------------
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
      if (res === 200 || res === 201) {
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

// ------------------------
// Top Menu Controller
// ------------------------
app.controller('SidebarCtrl', ['$scope', '$location', 'AuthFactory', function ($scope, $location, AuthFactory) {
  $scope.logout = function () {
    AuthFactory.Logout()
    $location.path('/auth')
  }

  $scope.go = function (path) {
    $location.path(path)
  }
}])

// -----------------------------------
// Controller for the verification Page
// -----------------------------------
app.controller('VerifyCtrl', ['$scope', '$location', 'AuthFactory', 'AddressFactory', '$sessionStorage', 'SweetAlert', function ($scope, $location, AuthFactory, AddressFactory, $sessionStorage, SweetAlert) {
  $scope.details = {}

  AddressFactory.getAddress($sessionStorage.currentUser.delegate, null, function (addresses) {
    $scope.addresses = addresses
  })

  AddressFactory.getToSendAddress(function (res) {
    $scope.details.address = res
  })

  $scope.verify = function () {
    AddressFactory.Confirm($scope.address.address, $scope.txId, function (err, data) {
      if (err) {
        SweetAlert.swal('Error', 'Transaction not found. Please retry in 10s.', 'error')
      } else {
        if (data.confirmed) {
          SweetAlert.swal({
            title: 'Address verified !',
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

  $scope.updateDetails = function () {
    console.log($scope.address)
    $scope.details.amount = $scope.address.confirmAmount
  }
}])

// ----------------------------------------
// Controller for the Delegates Display Page
// ----------------------------------------
app.controller('DelegatesCtrl', ['$scope', '$location', 'AuthFactory', '$sessionStorage', 'SweetAlert', function ($scope, $location, AuthFactory, $sessionStorage, SweetAlert) {
  AuthFactory.displayAll(function (res) {
    $scope.delegates = res
  })
}])

// ----------------------------------------
// Controller for the profile Page
// ----------------------------------------
app.controller('ProfileCtrl', ['$scope', '$location', 'AuthFactory', 'AddressFactory', '$sessionStorage', 'SweetAlert', function ($scope, $location, AuthFactory, AddressFactory, $sessionStorage, SweetAlert) {
  // Got it in param from the url
  let userToDisplayReport = $sessionStorage.currentUser.delegate
  let userPublickey
  AuthFactory.getUserh(userToDisplayReport, function (res) {
    $scope.delegate = res
    userPublickey = res.publicKey

    AddressFactory.getAddress($sessionStorage.currentUser.delegate, null, function (res) {
      $scope.addresses = res
    })

    AuthFactory.getTotalLisksForgedForUser(userPublickey, function (res) {
      $scope.totalForgedLisksForUser = res
    })
  })

  $scope.saveAddress = function () {
    if (!$scope.newAddress || !$scope.newCategory) {
      SweetAlert.swal('Error', 'Please fill all the fields', 'error')
      return
    }
    AddressFactory.Add($scope.newAddress, $scope.newCategory, function (res) {
      if (res.status === 200 || res.status === 201) {
        SweetAlert.swal('Done', 'Your address has been saved', 'success')
        $scope.newAddress = ''
        AddressFactory.getAddress($sessionStorage.currentUser.delegate, null, function (res) {
          $scope.addresses = res
        })
      } else {
        SweetAlert.swal('Error', res.data.error, 'error')
      }
    })
  }
}])

// -----------------------------
// Controller for the report Page
// -----------------------------
app.controller('ReportCtrl', ['$scope', '$location', '$routeParams', 'AuthFactory', 'AddressFactory', '$sessionStorage', function ($scope, $location, $routeParams, AuthFactory, AddressFactory, $sessionStorage) {
  // Got it in param from the url
  let userToDisplayReport = $routeParams.param1
  let userPublickey

  AuthFactory.getUserh(userToDisplayReport, function (res) {
    $scope.delegate = res
    userPublickey = res.publicKey

    AuthFactory.getTotalLisksForgedForUser(userPublickey, function (res) {
      $scope.totalForgedLisksForUser = res
    })
    AddressFactory.getAddress(userToDisplayReport, null, function (res) {
      $scope.addresses = res
    })
  })
}])

app.controller('ResetCtrl', ['$scope', '$location', '$routeParams', 'AuthFactory', 'AddressFactory', '$sessionStorage', 'SweetAlert', function ($scope, $location, $routeParams, AuthFactory, AddressFactory, $sessionStorage, SweetAlert) {
  $scope.reset = function () {
    if (!$scope.reset.delegate) {
      SweetAlert.swal('Error', 'Please fill all the fields', 'error')
      return
    }
    AuthFactory.initResetPassword($scope.reset.delegate, function (success) {
      if (success) {
        $location.path('/resetpassword/' + $scope.reset.delegate)
      } else {
        SweetAlert.swal('Error', 'Error during process, please try again or contact the keymaster or the oracle.', 'error')
      }
    })
  }
}])

app.controller('ResetPasswordCtrl', ['$scope', '$location', '$routeParams', 'AuthFactory', 'AddressFactory', '$sessionStorage', 'SweetAlert', function ($scope, $location, $routeParams, AuthFactory, AddressFactory, $sessionStorage, SweetAlert) {
  let delegate = $routeParams.param1

  $scope.delegate = delegate
  AuthFactory.resetPasswordAmount(delegate, function (res) {
    $scope.amount = res.amount
    $scope.address = res.address
  })

  $scope.verify = function () {
    if (!$scope.newPassword || !$scope.newConfirmedPassword || !$scope.txId) {
      SweetAlert.swal('Error', 'Please fill all the fields', 'error')
      return
    }
    if ($scope.newPassword !== $scope.newConfirmedPassword) {
      SweetAlert.swal('Error', 'The passwords are not the same', 'error')
      return
    }
    AuthFactory.resetPassword(delegate, $scope.txId, $scope.newPassword, function (err, success) {
      if (err) {
        SweetAlert.swal('Error', 'Unknown error.', 'error')
      } else {
        if (success) {
          SweetAlert.swal({
            title: 'Password reset successful !',
            type: 'success'
          }, function () {
            $location.path('/')
          })
        } else {
          SweetAlert.swal('Error', 'This transaction do not match above details.', 'error')
        }
      }
    })
  }
}])

app.run(function ($rootScope, $location, $http, $sessionStorage) {
  if (typeof $sessionStorage.currentUser !== 'undefined') {
    $http.defaults.headers.common.Authorization = $sessionStorage.currentUser.token
  }
  // register listener to watch route changes
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (!$sessionStorage.currentUser || !$sessionStorage.currentUser.token) {
      // no logged user, we should be going to #auth
      if (next.templateUrl !== 'templates/auth.html' && next.templateUrl !== 'templates/reset.html' && next.templateUrl !== 'templates/resetpassword.html') {
        // not going to #auth, we should redirect now
        $location.path('/auth')
      }
    } else {
      if (next.templateUrl === 'templates/auth.html' || next.templateUrl === 'templates/reset.html' || next.templateUrl === 'templates/resetpassword.html') {
        $location.path('/')
      }
    }
  })
})
