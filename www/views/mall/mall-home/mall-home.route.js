angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('mallHome',{
            nativeTransitions:null,
            url:'/mall/home',
            templateUrl:'views/mall/mall-home/mall-home.html',
            controller:'mallHomeCtl',
            data:{isPublic:true}
        })
    });