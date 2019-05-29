angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('needRentList',{
            url:'/tabs/home/needrentlist/params/:type',
            templateUrl:'views/tabs/home/needSource/needRentList/needRentList.html',
            controller:'needRentListCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/needSource/needRentList/needRentList.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });