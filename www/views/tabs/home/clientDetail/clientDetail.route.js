angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('clientDetail',{
            url:'/ifhavehouse/next/clientdetail',
            templateUrl:'views/tabs/home/clientDetail/clientDetail.html',
            controller:'clientDetailCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/clientDetail/clientDetail.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });