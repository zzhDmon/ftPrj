angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('myBusinessCard',{
            url:'/percenter/mybusinesscard/params/:tag',
            // cache:false,
            templateUrl:'views/tabs/perCenter/myBusinessCard/myBusinessCard.html',
            controller:'myBusinessCardCtl',
            data:{isPublic:false}
        })
    });