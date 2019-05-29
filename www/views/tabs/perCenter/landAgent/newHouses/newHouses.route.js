angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('newHouses',{
                url:'/percenter/landagent/newhouses',
                cache:false,
                templateUrl:'views/tabs/perCenter/landAgent/newHouses/newHouses.html',
                controller:'newHousesCtl',
                data:{isPublic:false}
            })
    });