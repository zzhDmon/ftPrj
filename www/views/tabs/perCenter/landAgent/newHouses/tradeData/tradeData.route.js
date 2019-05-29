angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('tradeData',{
                url:'/percenter/landagent/newhouses/tradedata/:id',
                templateUrl:'views/tabs/perCenter/landAgent/newHouses/tradeData/tradeData.html',
                controller:'tradeDataCtl',
                data:{isPublic:true}
            })
    });