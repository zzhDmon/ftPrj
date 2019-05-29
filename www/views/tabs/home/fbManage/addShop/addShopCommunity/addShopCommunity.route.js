angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addShopCommunity',{
            url:'/home/fbmanage/addShop/addShopcommunity',
            cache:false,
            templateUrl:'views/tabs/home/fbManage/addShop/addShopCommunity/addShopCommunity.html',
            controller:'addShopCommunityCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbManage/addShop/addShopCommunity/addShopCommunity.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });