angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('buyNeedBC',{
            url:'/home/needmanage/addneedbuy/buyneedbc',
            cache:false,
            templateUrl:'views/tabs/home/needManage/addBuyNeed/buyNeedBC/buyNeedBC.html',
            controller:'buyNeedBCCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/needManage/addBuyNeed/buyNeedBC/buyNeedBC.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });