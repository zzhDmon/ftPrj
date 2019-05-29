angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('ownerColumn',{
            url:'/ownercolumn',
            // cache:false,
            templateUrl:'views/tabs/home/ownerColumn/ownerColumn.html',
            controller:'ownerColumnCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/ownerColumn/ownerColumn.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });