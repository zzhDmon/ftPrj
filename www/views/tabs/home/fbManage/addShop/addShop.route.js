angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addShop',{
            url:'/home/fbmanage/addshop/params/:id/:type/:behaviour',
            cache:false,
            templateUrl:'views/tabs/home/fbManage/addShop/addShop.html',
            controller:'addShopCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbManage/addShop/addShop.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });