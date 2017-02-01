var app = angular.module('app', ['ngRoute', 'ngResource', 'ngStorage', 'oitozero.ngSweetAlert'])

app.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.hashPrefix('')
}])
