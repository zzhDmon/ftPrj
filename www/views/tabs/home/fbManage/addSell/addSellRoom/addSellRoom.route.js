angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addSellRoom',{
            url:'/home/fbmanage/addsell/addsellroom',
            cache:false,
            templateUrl:'views/tabs/home/fbManage/addSell/addSellRoom/addSellRoom.html',
            controller:'addSellRoomCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbManage/addSell/addSellRoom/addSellRoom.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });