angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addRentNeed',{
            url:'/needmanage/addrentneed/params/:type/:id',
            templateUrl:'views/tabs/home/needManage/addRentNeed/addRentNeed.html',
            controller:'addRentNeedCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/needManage/addRentNeed/addRentNeed.js'
                    ]);
                }],
            },
            data:{isPublic:false}
        })
    });