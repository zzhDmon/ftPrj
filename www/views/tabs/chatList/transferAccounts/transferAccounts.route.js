angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('transferAccounts',{
                url:'/chatlist/transferaccounts/params/:id',
                cache:false,
                templateUrl:'views/tabs/chatList/transferAccounts/transferAccounts.html',
                controller:'transferAccountsCtl',
                data:{isPublic:false}
            })
    });