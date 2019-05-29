angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('myMallAttentions',{
            url:'/mall/mallmine/mymallattentions',
            templateUrl:'views/mall/mall-mine/my-mallAttentions/my-mallAttentions.html',
            controller:'myMallAttentionsCtl',
            data:{isPublic:false}
        })
    });