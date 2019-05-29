angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('checkPage',{
                url:'/percenter/landagent/checkpage/:buyerid/:proxerid/:houseid/:showtype',
                templateUrl:'views/tabs/perCenter/landAgent/checkPage/checkPage.html',
                controller:'checkPageCtl',
                data:{isPublic:true}
            })
    });