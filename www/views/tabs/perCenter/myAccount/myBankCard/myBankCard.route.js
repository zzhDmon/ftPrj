angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('tabs.myBankCard',{
            url:'/percenter/myaccount/mybankcard/params/:actiontype',
            cache:false,
            views:{
                mine:{
                    templateUrl:'views/tabs/perCenter/myAccount/myBankCard/myBankCard.html',
                    controller:'myBankCardCtl',
                }
            },
            data:{isPublic:false}
        })
    });