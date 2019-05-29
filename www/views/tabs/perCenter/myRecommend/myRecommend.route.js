angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('myRecommend',{
            url:'/percenter/myrecommend',
            templateUrl:'views/tabs/perCenter/myRecommend/myRecommend.html',
            controller:'myRecommendCtl',
            data:{isPublic:false}
        })
    });