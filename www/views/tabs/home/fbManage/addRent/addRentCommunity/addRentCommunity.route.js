angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addRentCommunity',{
            url:'/home/fbmanage/addrent/addrentcommunity',
            cache:false,
            templateUrl:'views/tabs/home/fbManage/addRent/addRentCommunity/addRentCommunity.html',
            controller:'addRentCommunityCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbManage/addRent/addRentCommunity/addRentCommunity.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });