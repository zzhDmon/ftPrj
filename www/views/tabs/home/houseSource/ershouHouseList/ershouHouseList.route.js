angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('ershouHouseList',{
            url:'/housesource/ershoupage/ershouhouselist/:classify/:district/:street/:roomtype/:sort/:minprize/:maxprize/:query/:date',
            // cache:false,
            templateUrl:'views/tabs/home/houseSource/ershouHouseList/ershouHouseList.html',
            controller:'ershouHouseListCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/houseSource/ershouHouseList/ershouHouseList.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });