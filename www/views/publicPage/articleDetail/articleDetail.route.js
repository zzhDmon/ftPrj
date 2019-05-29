angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('articleDetail',{
            url:'/articledetail/params/:id',
            templateUrl:'views/publicPage/articleDetail/articleDetail.html',
            controller:'articleDetailCtl',
            data:{isPublic:true}
        })
    });