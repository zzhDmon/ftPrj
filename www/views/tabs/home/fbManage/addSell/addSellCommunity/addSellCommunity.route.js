angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addSellCommunity',{
            url:'/home/fbmanage/addsell/addsellcommunity',
            cache:false,
            templateUrl:'views/tabs/home/fbManage/addSell/addSellCommunity/addSellCommunity.html',
            controller:'addSellCommunityCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbManage/addSell/addSellCommunity/addSellCommunity.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });