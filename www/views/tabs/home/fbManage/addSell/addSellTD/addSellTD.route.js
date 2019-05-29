angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addSellTD',{
            url:'/home/fbmanage/addsell/addselltd/:name',
            cache:false,
            templateUrl:'views/tabs/home/fbManage/addSell/addSellTD/addSellTD.html',
            controller:'addSellTDCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbManage/addSell/addSellTD/addSellTD.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });