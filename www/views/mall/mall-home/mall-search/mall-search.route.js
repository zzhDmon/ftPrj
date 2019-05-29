angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('mallSearch',{
            url:'/mall/home/mallsearch',
            cache:false,
            templateUrl:'views/mall/mall-home/mall-search/mall-search.html',
            controller:'mallSearchCtl',
            data:{isPublic:true}
        })
    });