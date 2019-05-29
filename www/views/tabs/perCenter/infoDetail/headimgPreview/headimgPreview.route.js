angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('headimgPreview',{
                url:'/percenter/infodetail/headimgpreview',
                cache:false,
                templateUrl:'views/tabs/perCenter/infoDetail/headimgPreview/headimgPreview.html',
                controller:'headimgPreviewCtl',
                data:{isPublic:false}
            })
    });