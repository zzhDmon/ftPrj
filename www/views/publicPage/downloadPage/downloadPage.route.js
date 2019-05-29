angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('downloadPage',{
                url:'/downloadpage/:nimid',
                cache:false,
                templateUrl:'views/publicPage/downloadPage/downloadPage.html',
                controller:'downloadPageCtl',
                data:{isPublic:true}
            })
    });