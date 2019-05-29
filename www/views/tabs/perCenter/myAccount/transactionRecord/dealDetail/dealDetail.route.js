angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('dealDetail',{
            url:'/percenter/myaccount/transactionrecord/dealdetail/params/:order',
            templateUrl:'views/tabs/perCenter/myAccount/transactionRecord/dealDetail/dealDetail.html',
            controller:'dealDetailCtl',
            data:{isPublic:false}
        })
    });