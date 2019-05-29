angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('chooseHouseTags',{
            url:'/home/fbmanage/choosehousetags/params/:name',
            cache:false,
            templateUrl:'views/tabs/home/fbManage/chooseHouseTags/chooseHouseTags.html',
            controller:'chooseHouseTagsCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbManage/chooseHouseTags/chooseHouseTags.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });