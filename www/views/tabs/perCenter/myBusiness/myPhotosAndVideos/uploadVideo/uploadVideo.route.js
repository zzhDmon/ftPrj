angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('uploadVideo',{
            url:'/percenter/mybusiness/myphotosandvideos/uploadVideo',
            cache:false,
            templateUrl:'views/tabs/perCenter/myBusiness/myPhotosAndVideos/uploadVideo/uploadVideo.html',
            controller:'uploadVideoCtl',
            data:{isPublic:false}
        })
    });