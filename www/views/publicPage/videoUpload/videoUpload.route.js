angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('videoUpload',{
            url: '/videoupload',
            // cache:false,
        	templateUrl: 'views/publicPage/videoUpload/videoUpload.html',
        	controller:'videoUploadCtl',
        	data:{isPublic:false}
        })
    });