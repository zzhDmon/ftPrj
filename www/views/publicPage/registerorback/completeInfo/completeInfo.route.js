angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('CompleteInfo',{
            cache:false,
            url: '/registerorback/next/completeinfo',
            templateUrl: 'views/publicPage/registerorback/completeInfo/completeInfo.html',
            controller:'CompleteInfoCtl',
            data:{isPublic:true}
        })
    });