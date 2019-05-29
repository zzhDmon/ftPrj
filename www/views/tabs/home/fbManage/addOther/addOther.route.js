angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addOther',{
            url:'/home/fbmanage/next/addOther/params/:id/:type/:behaviour',
            cache:false,
            templateUrl:'views/tabs/home/fbManage/addOther/addOther.html',
            controller:'addOtherCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbManage/addOther/addOther.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });