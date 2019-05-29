angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addSell',{
            url:'/home/fbmanage/addsell/params/:id',
            cache:false,
            templateUrl:'views/tabs/home/fbManage/addSell/addSell.html',
            controller:'addSellCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbManage/addSell/addSell.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });