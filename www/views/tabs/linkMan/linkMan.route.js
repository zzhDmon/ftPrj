angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('tabs.linkMan',{
            url:'/linkman',
            // nativeTransitions: {
            //     type: "fade"
            // },
            nativeTransitions:null,
            views:{
                find:{
                    templateUrl:'views/tabs/linkMan/linkMan.html',
                    controller:'linkManCtr'
                }
            },
            data:{isPublic:false}
        })
    });