angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('usageRules',{
            url:'/newhousedetail/usagerules',
            templateUrl:'views/publicPage/newHouseDetail/usageRules/usageRules.html',
            controller:'usageRulesCtl',
            data:{isPublic:true}
        })
    });