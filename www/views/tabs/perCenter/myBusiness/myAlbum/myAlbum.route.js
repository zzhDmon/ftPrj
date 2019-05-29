angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('myAlbum',{
            url:'/percenter/mybusiness/myalbum/params/:uid',
            templateUrl:'views/tabs/perCenter/myBusiness/myAlbum/myAlbum.html',
            controller:'myAlbumCtl',
            data:{isPublic:false}
        })
    });