angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('applyForStore',{
            url: '/mall/mallmine/applyforstore',
            cache:false,
            templateUrl: 'views/mall/mall-mine/applyForStore/applyForStore.html',
            controller:'applyForStoreCtl',
            data:{isPublic:false}
        })
    });