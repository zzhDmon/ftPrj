angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('houseTimes',{
            url:'/housetimes/:id',
            templateUrl:'views/tabs/home/houseTimes/houseTimes.html',
            controller:'houseTimesCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/houseTimes/houseTimes.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });