angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('needBuyList',{
            url:'/tabs/home/needbuylist/params/:type',
            templateUrl:'views/tabs/home/needSource/needBuyList/needBuyList.html',
            controller:'needBuyListCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/needSource/needBuyList/needBuyList.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });