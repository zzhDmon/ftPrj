angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('mallMine',{
            nativeTransitions:null,
            url:'/mall/mine',
            templateUrl:'views/mall/mall-mine/mall-mine.html',
            controller:'mallMineCtl',
            data:{isPublic:true}
        })
    });