angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('daibanList',{
            url:'/ifhavehouse/daibanlist',
            templateUrl:'views/tabs/home/daibanList/daibanList.html',
            controller:'daibanListCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/daibanList/daibanList.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });