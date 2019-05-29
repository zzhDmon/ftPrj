angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('realHouseList',{
            url:'/percenter/realhouselist',
            templateUrl:'views/tabs/perCenter/realHouseList/realHouseList.html',
            controller:'realHouseListCtl',
            data:{isPublic:false}
        })
    });