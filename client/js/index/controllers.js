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

    AuthFactory.getTotalLisksForgedForUser(userPublickey, function (res) {
      $scope.totalForgedLisksForUser = res
      $scope.totalForgedLisksForUser.fees = res.fees / 10000000
      $scope.totalForgedLisksForUser.rewards = res.rewards / 10000000
      $scope.totalForgedLisksForUser.forged = res.forged / 10000000
    })
  })

  $scope.saveAddress = function () {
    if (!$scope.address || !$scope.category) {
      SweetAlert.swal('Error', 'Please fill all the fields', 'error')
      return
    }
    AddressFactory.Add($scope.address, $scope.category, function (res) {
      if (res.status === 200 || res.status === 201) {
        SweetAlert.swal('Done', 'Your address has been saved', 'success')
        AddressFactory.getAddresses($sessionStorage.currentUser.delegate, function (res) {
          $scope.addresses = res
        })
      } else {
        SweetAlert.swal('Error', res.data.error, 'error')
      }
    })
  }

  AddressFactory.getAddresses($sessionStorage.currentUser.delegate, function (res) {
    $scope.addresses = res
  })
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
      $scope.totalForgedLisksForUser.fees = res.fees / 10000000
      $scope.totalForgedLisksForUser.rewards = res.rewards / 10000000
      $scope.totalForgedLisksForUser.forged = res.forged / 10000000
    })
    AddressFactory.getAddresses(userToDisplayReport, function (res) {
      $scope.addresses = res
    })
  })
}])

app.run(function ($rootScope, $location, $http, $sessionStorage) {
  if (typeof $sessionStorage.currentUser !== 'undefined') {
    $http.defaults.headers.common.Authorization = $sessionStorage.currentUser.token
  }
  // register listener to watch route changes
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (!$sessionStorage.currentUser || !$sessionStorage.currentUser.token) {
      // no logged user, we should be going to #auth
      if (next.templateUrl !== 'templates/auth.html') {
        // not going to #auth, we should redirect now
        $location.path('/auth')
      }
    } else {
      if (next.templateUrl === 'templates/auth.html') {
        $location.path('/')
      }
    }
  })
})
