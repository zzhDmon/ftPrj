angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('newHousePage',{
            url:'/tabs/newhousepage',
            templateUrl:'views/tabs/home/houseSource/newHousePage/newHousePage.html',
            controller:'newHousePageCtl',
            data:{isPublic:true}
        })
    });