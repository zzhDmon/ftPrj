angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('otherHouseDetail',{
            url: '/otherhousedetail/:id/:isshop',
            cache:false,
            templateUrl: 'views/publicPage/otherHouseDetail/otherHouseDetail.html',
            controller:'otherHouseDetailCtl',
            data:{isPublic:true}
        })
    });