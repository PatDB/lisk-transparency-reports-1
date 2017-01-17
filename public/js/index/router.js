/*
lisk-transparency-reports v0.0.0
https://github.com/SherlockStd/lisk-transparency-reports
*/

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
