angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('changeInfo',{
                url:'/percenter/infodetail/changeinfo/:name',
                cache:false,
                templateUrl:'views/tabs/perCenter/infoDetail/changeInfo/changeInfo.html',
                controller:'changeInfoCtl',
                data:{isPublic:false}
            })
    });