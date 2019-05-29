angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('myPhotosAndVideos',{
            url:'/percenter/mybusiness/myphotosandvideos/params/:uid',
            cache:false,
            templateUrl:'views/tabs/perCenter/myBusiness/myPhotosAndVideos/myPhotosAndVideos.html',
            controller:'myPhotosAndVideosCtl',
            data:{isPublic:false}
        })
    });