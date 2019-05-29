angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addBuyNeed',{
            url:'/needmanage/addbuyneed/params/:type/:id',
            templateUrl:'views/tabs/home/needManage/addBuyNeed/addBuyNeed.html',
            controller:'addBuyNeedCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/needManage/addBuyNeed/addBuyNeed.js'
                    ]);
                }],
            },
            data:{isPublic:false}
        })
    });