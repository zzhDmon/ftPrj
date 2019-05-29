angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('transactionRecord',{
            url:'/percenter/myaccount/transactionrecord',
            templateUrl:'views/tabs/perCenter/myAccount/transactionRecord/transactionRecord.html',
            controller:'transactionRecordCtl',
            data:{isPublic:false}
        })
    });