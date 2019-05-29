angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('needRentPage',{
            url:'/tabs/needsource/needrentpage',
            templateUrl:'views/tabs/home/needSource/needRentPage/needRentPage.html',
            controller:'needRentPageCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/needSource/needRentPage/needRentPage.js'
                    ]);
                }],
            },	
            data:{isPublic:true}
        })
    });