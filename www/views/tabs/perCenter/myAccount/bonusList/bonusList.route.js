angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('bonusList',{
            url:'/percenter/myaccount/bonuslist/params/:id',
            cache:false,
            templateUrl:'views/tabs/perCenter/myAccount/bonusList/bonusList.html',
            controller:'bonusListCtl',
            data:{isPublic:false}
        })
    });