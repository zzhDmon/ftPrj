angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('myPhotos',{
            url:'/percenter/mybusiness/myphotos/params/:uid/:id',
            cache:false,
            templateUrl:'views/tabs/perCenter/myBusiness/myPhotos/myPhotos.html',
            controller:'myPhotosCtl',
            data:{isPublic:false}
        })
    });