angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('newHouseDetail',{
            url: '/newhousedetail/params/:id',
            cache:false,
            templateUrl: 'views/publicPage/newHouseDetail/newHouseDetail.html',
            controller:'newHouseDetailCtl',
            data:{isPublic:true}
        })
    });