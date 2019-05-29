angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('mallClassify',{
            nativeTransitions:null,
            url:'/mall/classify',
            templateUrl:'views/mall/mall-classify/mall-classify.html',
            controller:'mallClassifyCtl',
            data:{isPublic:true}
        })
    });