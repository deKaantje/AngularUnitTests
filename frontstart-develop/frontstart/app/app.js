/**
 * App module
 */

var app = angular.module('unitTest', ['ui.router', 'toastr', 'ngResource', 'checklist-model', 'angular.filter', 'angular.chosen']);


app.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.	
        'http://s3.eu-central-1.amazonaws.com/**'
    ]);
});