angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('visitDone',{
            url:'/percenter/visitdone/:proxerid/:buyerid/:houseid',
            templateUrl:'views/tabs/perCenter/visitDone/visitDone.html',
            controller:'visitDoneCtl',
            data:{isPublic:true}
        })
    });