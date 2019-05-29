angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
            .state('busintroImgCut',{
                url:'/percenter/mybusiness/busintroimgcut/params/:imgurl/:orientation',
                cache:false,
                templateUrl:'views/tabs/perCenter/myBusiness/busintroImgCut/busintroImgCut.html',
                controller:'busintroImgCutCtl',
                data:{isPublic:false}
            })
    });