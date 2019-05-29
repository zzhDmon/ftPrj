angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('myAccount',{
                url:'/percenter/myaccount',
                templateUrl:'views/tabs/perCenter/myAccount/myAccount.html',
                controller:'myAccountCtl',
                data:{isPublic:false}
            })
    });