angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('forgetPayPassword',{
            url:'/percenter/myaccount/forgetpaypassword',
            templateUrl:'views/tabs/perCenter/myAccount/forgetPayPassword/forgetPayPassword.html',
            controller:'forgetPayPasswordCtl',
            data:{isPublic:true}
        })
    });