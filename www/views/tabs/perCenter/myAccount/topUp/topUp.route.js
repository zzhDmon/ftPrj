angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('tabs.topUp',{
                url:'/percenter/myaccount/topup',
                cache:false,
                views:{
                    mine:{
                        templateUrl:'views/tabs/perCenter/myAccount/topUp/topUp.html',
                        controller:'topUpCtl',
                    }
                },
                data:{isPublic:false}
            })
    });