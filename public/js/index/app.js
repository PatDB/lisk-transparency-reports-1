/*
lisk-transparency-reports v0.0.0
https://github.com/SherlockStd/lisk-transparency-reports
*/

var app = angular.module('app', ['ngRoute', 'ngResource', 'ngStorage', 'oitozero.ngSweetAlert'])

app.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.hashPrefix('')
}])
