angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('manageBankCard',{
            url:'/percenter/myaccount/mybankcard/managebankcard/:cardnumber',
            templateUrl:'views/tabs/perCenter/myAccount/myBankCard/manageBankCard/manageBankCard.html',
            controller:'manageBankCardCtl',
            data:{isPublic:false}
        })
    });