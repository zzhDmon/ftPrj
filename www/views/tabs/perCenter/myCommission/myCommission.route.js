angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('myCommission',{
            url:'/percenter/mycommission',
            templateUrl:'views/tabs/perCenter/myCommission/myCommission.html',
            controller:'myCommissionCtl',
            data:{isPublic:false}
        })
    });