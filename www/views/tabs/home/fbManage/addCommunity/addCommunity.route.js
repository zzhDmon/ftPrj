angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addCommunity',{
            url:'/ifhavehouse/fbmanage/next/addcommunity',
            cache:false,
            templateUrl:'views/tabs/home/fbManage/addCommunity/addCommunity.html',
            controller:'addCommunityCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbManage/addCommunity/addCommunity.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });