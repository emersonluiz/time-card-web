app.config(function ($routeProvider) {
     $routeProvider.when('/login', {
        templateUrl: 'app/components/authentication/loginController.html',
        controller: 'loginController'
    })
    $routeProvider.when('/timeCard', {
        templateUrl: 'app/components/timeCard/timeCardController.html',
        controller: 'timeCardController'
    })
    $routeProvider.when('/timeCardCreate/:date', {
        templateUrl: 'app/components/timeCard/timeCardCreateController.html',
        controller: 'timeCardCreateController'
    })
    .otherwise({
        redirectTo: '/login'
    })
})


.run(function ($http, $rootScope, $location) {

    $rootScope.$on('$routeChangeStart', function (event, next, current) {

    })

})
