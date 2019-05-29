angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('rentNeedBC',{
            url:'/home/needmanage/addneedrent/rentneedbc',
            cache:false,
            templateUrl:'views/tabs/home/needManage/addRentNeed/rentNeedBC/rentNeedBC.html',
            controller:'rentNeedBCCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/needManage/addRentNeed/rentNeedBC/rentNeedBC.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });