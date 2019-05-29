angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addRent',{
            url:'/home/fbmanage/addrent/params/:id/:type/:attach',
            cache:false,
            templateUrl:'views/tabs/home/fbManage/addRent/addRent.html',
            controller:'addRentCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbManage/addRent/addRent.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });