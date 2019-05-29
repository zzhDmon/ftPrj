angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('dialogLocation',{
                url:'/chatlist/dialoglocation/params/:lng/:lat/:mark',
                cache:false,
                templateUrl:'views/tabs/chatList/dialogLocation/dialogLocation.html',
                controller:'dialogLocationCtl',
                data:{isPublic:false}
            })
    });