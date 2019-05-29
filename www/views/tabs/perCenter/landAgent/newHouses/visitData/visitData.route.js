angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('visitData',{
                url:'/percenter/landagent/newhouses/visitdata/:id',
                templateUrl:'views/tabs/perCenter/landAgent/newHouses/visitData/visitData.html',
                controller:'visitDataCtl',
                data:{isPublic:true}
            })
    });