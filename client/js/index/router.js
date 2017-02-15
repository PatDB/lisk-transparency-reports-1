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
  .when('/delegates', {
    templateUrl: 'templates/delegates.html',
    controller: 'DelegatesCtrl'
  })
  .when('/report/:param1', {
    templateUrl: 'templates/report.html',
    controller: 'ReportCtrl'
  })
  .when('/profile', {
    templateUrl: 'templates/profile.html',
    controller: 'ProfileCtrl'
  })
}])
