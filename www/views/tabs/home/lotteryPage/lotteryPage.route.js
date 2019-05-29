angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('lotteryPage',{
            url:'/home/lotteryPage',
            // cache:false,
            templateUrl:'views/tabs/home/lotteryPage/lotteryPage.html',
            controller:'lotteryPageCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/lotteryPage/lotteryPage.js'
                    ]);
                }],
            },
            data:{isPublic:false}
        })
    });