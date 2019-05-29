angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addSellAddress',{
            url:'/home/fbmanage/addsell/addselladdress',
            cache:false,
            templateUrl:'views/tabs/home/fbManage/addSell/addSellAddress/addSellAddress.html',
            controller:'addSellAddressCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbManage/addSell/addSellAddress/addSellAddress.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });