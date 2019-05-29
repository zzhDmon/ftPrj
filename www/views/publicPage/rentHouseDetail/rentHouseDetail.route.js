angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('rentHouseDetail',{
            url: '/renthousedetail/:id',
            cache:false,
            templateUrl: 'views/publicPage/rentHouseDetail/rentHouseDetail.html',
            controller:'rentHouseDetailCtl',
            data:{isPublic:true}
        })
    });