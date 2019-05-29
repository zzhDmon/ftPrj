angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('aboutUs',{
            url:'/publicpage/myset/aboutus',
            templateUrl:'views/publicPage/mySet/aboutUs/aboutUs.html',
            controller:'aboutUsCtl',
            data:{isPublic:true}
        })
    });