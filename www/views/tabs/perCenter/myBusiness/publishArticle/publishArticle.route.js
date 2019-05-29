angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('publishArticle',{
            url:'/percenter/mybusiness/publisharticle',
            cache:false,
            templateUrl:'views/tabs/perCenter/myBusiness/publishArticle/publishArticle.html',
            controller:'publishArticleCtl',
            data:{isPublic:false}
        })
    });