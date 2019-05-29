angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('needBuyPage',{
            url:'/tabs/needsource/needbuypage',
            templateUrl:'views/tabs/home/needSource/needBuyPage/needBuyPage.html',
            controller:'needBuyPageCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/needSource/needBuyPage/needBuyPage.js'
                    ]);
                }],
            },	
            data:{isPublic:true}
        })
    });