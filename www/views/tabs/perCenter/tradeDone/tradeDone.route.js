angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('tradeDone',{
            url:'/percenter/tradedone/:proxerid/:buyerid/:houseid',
            templateUrl:'views/tabs/perCenter/tradeDone/tradeDone.html',
            controller:'tradeDoneCtl',
            data:{isPublic:true}
        })
    });