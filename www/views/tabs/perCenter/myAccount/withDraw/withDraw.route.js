angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('tabs.withDraw',{
                url:'/percenter/myaccount/withdraw',
                cache:false,
                views:{
                    mine:{
                        templateUrl:'views/tabs/perCenter/myAccount/withDraw/withDraw.html',
                        controller:'withDrawCtl',
                    }
                },
                data:{isPublic:false}
            })
    });