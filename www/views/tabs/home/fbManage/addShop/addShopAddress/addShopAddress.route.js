angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addShopAddress',{
            url:'/home/fbmanage/addshop/addshopaddress',
            cache:false,
            templateUrl:'views/tabs/home/fbManage/addShop/addShopAddress/addShopAddress.html',
            controller:'addShopAddressCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbManage/addShop/addShopAddress/addShopAddress.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });