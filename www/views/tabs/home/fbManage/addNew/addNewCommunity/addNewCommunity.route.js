angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addNewCommunity',{
            url:'/home/fbmanage/addnew/addnewcommunity',
            templateUrl:'views/tabs/home/fbManage/addNew/addNewCommunity/addNewCommunity.html',
            controller:'addNewCommunityCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbManage/addNew/addNewCommunity/addNewCommunity.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });