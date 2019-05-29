angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('bindBankCard',{
            url:'/percenter/myaccount/mybankcard/bindbankcard/:isreset',
            cache:false,
            templateUrl:'views/tabs/perCenter/myAccount/myBankCard/bindBankCard/bindBankCard.html',
            controller:'bindBankCardCtl',
            data:{isPublic:false}
        })
    });