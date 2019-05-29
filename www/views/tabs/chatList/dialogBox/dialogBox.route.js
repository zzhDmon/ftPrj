angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('dialogBox',{
            url: '/chatlist/dialogbox/params/:id',
            // cache:false,
            templateUrl: 'views/tabs/chatList/dialogBox/dialogBox.html',
            controller:'dialogBoxCtl',
            data:{isPublic:false}
        })
    });