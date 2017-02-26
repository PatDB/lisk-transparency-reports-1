app.run(function ($rootScope, $location, $http, $sessionStorage) {
  if (typeof $sessionStorage.currentUser !== 'undefined') {
    $http.defaults.headers.common.Authorization = $sessionStorage.currentUser.token
  }

  // register listener to watch route changes
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if ($sessionStorage.currentUser) {
      if ($sessionStorage.currentUser.token) {
        // restricted pages for all logged user (can't access auth pages)
        if (next.templateUrl === 'templates/auth.html' || next.templateUrl === 'templates/reset.html' || next.templateUrl === 'templates/resetpassword.html') {
          $location.path('/')
        }

        if (!$sessionStorage.currentUser.confirmed) {
          // restricted pages for logged unconfirmed user (can only access public pages and addresses management page)
          if (next.templateUrl === 'templates/profile.html') {
            $location.path('/addresses')
          }
        }
      } else {
        // restricted pages for not logged user (can only access public page)
        if (next.templateUrl === 'templates/profile.html' || next.templateUrl === 'templates/addresses.html') {
          $location.path('/auth')
        }
      }
    }
  })
})
