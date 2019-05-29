angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('registerorback',{
            cache:false,
            url: '/registerorback/:name',
            templateUrl: 'views/publicPage/registerorback/registerorback.html',
            controller:'RegisterorbackController',
            data:{isPublic:true}
        })
    });