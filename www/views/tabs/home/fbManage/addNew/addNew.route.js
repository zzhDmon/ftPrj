angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addNew',{
            url:'/home/fbmanage/addnew/params/:id',
            cache:false,
            templateUrl:'views/tabs/home/fbManage/addNew/addNew.html',
            controller:'addNewCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbManage/addNew/addNew.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });