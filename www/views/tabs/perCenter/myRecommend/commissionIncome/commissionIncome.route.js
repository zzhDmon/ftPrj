angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('commissionIncome',{
            url:'/percenter/myrecommend/commissionincome',
            templateUrl:'views/tabs/perCenter/myRecommend/commissionIncome/commissionIncome.html',
            controller:'commissionIncomeCtl',
            data:{isPublic:false}
        })
    });