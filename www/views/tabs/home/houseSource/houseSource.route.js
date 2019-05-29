angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('houseSource',{
            url:'/tabs/housesource',
            templateUrl:'views/tabs/home/houseSource/houseSource.html',
            controller:'houseSourceCtl',
            data:{isPublic:true}
        })
    });