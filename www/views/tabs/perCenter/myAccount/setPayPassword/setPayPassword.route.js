angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('setPayPassword',{
                url:'/percenter/myaccount/setpaypassword',
                cache:false,
                templateUrl:'views/tabs/perCenter/myAccount/setPayPassword/setPayPassword.html',
                controller:'setPayPasswordCtl',
                data:{isPublic:false}
            })
    });