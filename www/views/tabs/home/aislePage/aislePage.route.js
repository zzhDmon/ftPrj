angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('aislePage',{
            url:'/aislePage/:type/:index',
            templateUrl:'views/tabs/home/aislePage/aislePage.html',
            controller:'aislePageCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/aislePage/aislePage.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });