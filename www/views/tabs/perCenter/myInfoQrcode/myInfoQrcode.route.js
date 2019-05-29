angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('myInfoQrcode',{
                url:'/percenter/myinfoqrcode/params/:id',
                cache:false,
                templateUrl:'views/tabs/perCenter/myInfoQrcode/myInfoQrcode.html',
                controller:'myInfoQrcodeCtl',
                data:{isPublic:false}
            })
    });