angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('sellHouseDetail',{
            url: '/sellhousedetail/:id',
            cache:false,
            templateUrl: 'views/publicPage/sellHouseDetail/sellHouseDetail.html',
            controller:'sellHouseDetailCtl',
            data:{isPublic:true}
        })
    });