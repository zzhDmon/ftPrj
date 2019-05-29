angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addRentTD',{
            url:'/home/fbmanage/addrent/addrenttd/:name',
            cache:false,
            templateUrl:'views/tabs/home/fbManage/addRent/addRentTD/addRentTD.html',
            controller:'addRentTDCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbManage/addRent/addRentTD/addRentTD.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });