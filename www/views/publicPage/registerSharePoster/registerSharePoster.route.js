angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('registerSharePoster',{
            url: '/registershareposter/:parphone',
            templateUrl: 'views/publicPage/registerSharePoster/registerSharePoster.html',
            controller:'registerSharePosterCtl',
            data:{isPublic:true}
        })
    });