angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('redEnvelope',{
            url:'/home/redenvelope',
            templateUrl:'views/tabs/home/redEnvelope/redEnvelope.html',
            controller:'redEnvelopeCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/redEnvelope/redEnvelope.js'
                    ]);
                }],
            },
            data:{isPublic:false}
        })
    });