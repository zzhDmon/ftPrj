angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('rentHouseList',{
            url:'/housesource/rentpage/rentlist/:classify/:district/:street/:roomtype/:sort/:minprize/:maxprize/:query/:date',
            templateUrl:'views/tabs/home/houseSource/rentHouseList/rentHouseList.html',
            controller:'rentHouseListCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/houseSource/rentHouseList/rentHouseList.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });