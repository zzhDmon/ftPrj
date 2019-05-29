angular.module('App')
    .config(function($stateProvider) {
        $stateProvider
        .state('tabs.newHouseArr',{
            url:'/tabs/newhousepage/newhouselist/:district/:street/:roomtype/:sort/:minprize/:maxprize/:query',
            views:{
                home:{
                    templateUrl:'views/tabs/home/houseSource/newHouseArr/newHouseArr.html',
                    controller:'newHouseArrCtl',
                }
            },
            data:{isPublic:true}
        })
    });