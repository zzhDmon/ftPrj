angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addressList',{
            url:'/mall/mallmine/addresslist',
            templateUrl:'views/mall/mall-mine/addressList/addressList.html',
            controller:'addressListCtl',
            data:{isPublic:true}
        })
    });