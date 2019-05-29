angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('tabs.perCenter',{
                url:'/percenter',
                nativeTransitions:null,
                views:{
                    mine:{
                        templateUrl:'views/tabs/perCenter/perCenter.html',
                        controller:'perCenterCtl'
                    }
                },
                data:{isPublic:true}
            })
    });