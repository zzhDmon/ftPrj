angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addOtherTD',{
            url:'/home/fbmanage/addother/addothertd/:name',
            cache:false,
            templateUrl:'views/tabs/home/fbManage/addOther/addOtherTD/addOtherTD.html',
            controller:'addOtherTDCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbManage/addOther/addOtherTD/addOtherTD.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });