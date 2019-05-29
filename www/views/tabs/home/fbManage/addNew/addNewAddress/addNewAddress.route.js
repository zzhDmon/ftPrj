angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('addNewAddress',{
            url:'/home/fbmanage/addnew/addnewaddress',
            cache:false,
            templateUrl:'views/tabs/home/fbManage/addNew/addNewAddress/addNewAddress.html',
            controller:'addNewAddressCtl',
            resolve:{
                load:['$ocLazyLoad',function($ocLazyLoad){
                    return $ocLazyLoad.load([
                        'views/tabs/home/fbManage/addNew/addNewAddress/addNewAddress.js'
                    ]);
                }],
            },
            data:{isPublic:true}
        })
    });