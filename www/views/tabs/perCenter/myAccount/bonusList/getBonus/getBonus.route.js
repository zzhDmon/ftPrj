angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('getBonus',{
            url:'/percenter/myaccount/bonuslist/getbonus/params/:id',
            templateUrl:'views/tabs/perCenter/myAccount/bonusList/getBonus/getBonus.html',
            controller:'getBonusCtl',
            data:{isPublic:false}
        })
    });