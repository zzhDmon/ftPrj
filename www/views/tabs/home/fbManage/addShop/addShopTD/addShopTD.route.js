angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addShopTD',{
            url:'/home/fbmanage/addshop/addshoptd/:name',
            cache:false,
            templateUrl:'views/tabs/home/fbManage/addShop/addShopTD/addShopTD.html',
            controller:'addShopTDCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbManage/addShop/addShopTD/addShopTD.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });