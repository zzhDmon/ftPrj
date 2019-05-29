angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('login',{
            url: '/login',
            cache:false,
            templateUrl: 'views/publicPage/login/login.html',
            controller:'LoginController',
            data:{isPublic:true}
        })
    });