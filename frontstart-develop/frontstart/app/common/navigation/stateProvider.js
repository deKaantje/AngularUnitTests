
// CONFIG
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

        .state('main', {
            url: '/',
            views: {
                'main@': {
                    templateUrl: 'frontstart/app/common/main/mainView.html',
                    controller: 'mainController'
                }
            }
        });

        
}]);