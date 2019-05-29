angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('makeCollections',{
                url:'/chatlist/makecollections/params/:fromid/:type/:fee/:tradeno/:otradno',
                cache:false,
                templateUrl:'views/tabs/chatList/makeCollections/makeCollections.html',
                controller:'makeCollectionsCtl',
                data:{isPublic:false}
            })
    });