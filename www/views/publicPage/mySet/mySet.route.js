angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('mySet',{
            url:'/publicpage/myset',
            cache:false,
            templateUrl:'views/publicPage/mySet/mySet.html',
            controller:'mySetCtl',
            data:{isPublic:false}
        })
    });