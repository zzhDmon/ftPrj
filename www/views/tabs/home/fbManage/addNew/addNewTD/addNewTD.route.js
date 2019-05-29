angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addNewTD',{
            url:'/home/fbmanage/addnew/addnewtd/params/:name',
            cache:false,
            templateUrl:'views/tabs/home/fbManage/addNew/addNewTD/addNewTD.html',
            controller:'addNewTDCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbManage/addNew/addNewTD/addNewTD.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });