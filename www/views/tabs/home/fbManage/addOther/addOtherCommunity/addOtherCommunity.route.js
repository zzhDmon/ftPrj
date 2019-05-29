angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addOtherCommunity',{
            url:'/home/fbmanage/addother/addothercommunity',
            cache:false,
            templateUrl:'views/tabs/home/fbManage/addOther/addOtherCommunity/addOtherCommunity.html',
            controller:'addOtherCommunityCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbManage/addOther/addOtherCommunity/addOtherCommunity.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });