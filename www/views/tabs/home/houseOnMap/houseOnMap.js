angular.module('App')
.controller('houseOnMapCtl',function(appUtils,$ionicModal,$interval,$timeout,$state,$Factory,$scope,$rootScope,$http){
	$scope.back=function(){
		appUtils.back();
	}

	$scope.switchIndex=1
	$scope.typeSwitch=function(index){
		$scope.switchIndex=index
		var left=50*(index - 1)+18+'%'
		$('#house_on_map .mid-switch').find('.under-line').animate({
			left:left
        },100)
        
        $scope.reloadMap(index)
	}

    $scope.$on('$ionicView.enter',function(){
        $ionicModal.fromTemplateUrl('house_on_map_modal', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.showModal=function(){
            $scope.modal.show();	
        }
        $scope.closeModal=function(){
            $scope.modal.hide();
        }
    })
    $scope.$on('$ionicView.leave',function(){
        $scope.modal.remove();
    })
   
    
   
    // 小区点的点击事件 并获取相关信息
    var mapClick = document.getElementById("house_on_map_baidumap");
　　mapClick.onclick = function(ev){
　　　　var ev = ev || window.event;
　　　　var target = ev.target || ev.srcElement;
　　　　if(target.nodeName.toLowerCase() == 'label'){
            $scope.showModal()
            var community_name=ev.target.lastElementChild.getAttribute('data-text');
            var city_name=ev.target.lastElementChild.getAttribute('data-city');
            $scope.loadHouse(community_name,city_name)
        }
　　}
    $scope.loadHouse=function(query,city){
        var cityid = 1
        switch(city){
            case '厦门':
                cityid=1;
                break
            case '漳州':
                cityid=2;
                break
            case '泉州':
                cityid=3;
                break
            case '福州':
                cityid=4;
                break
            case '宁德':
                cityid=5;
                break
            case '莆田':
                cityid=6;
                break
            case '龙岩':
                cityid=7;
                break
            case '三明':
                cityid=8;
                break
            case '南平':
                cityid=9;
                break
            case '中山':
                cityid=200;
                break
            default:
                cityid=1;
        }
        $scope.QueryData={
            cityId:cityid,
            pagesize:100,
            pagenum:0,
            type:$scope.switchIndex,
            query:query,
            district:'',
            street:'',
            minprize:'',
            maxprize:'',
            roomType:'',
            sort:''
        }
        $http.get($Factory.NewHouseSource.publicquery.url,{params:$scope.QueryData})
            .then(function(resData){
                for(var i=0;i<resData.data.length;i++){
                    var str=resData.data[i].Thumb
                    resData.data[i].Thumb=str.replace(/230x150/, "120x90")
                }
                if($scope.switchIndex==1){
                    $scope.oldhousearr=resData.data;
                }else{
                    $scope.renthousearr=resData.data;
                }
            })
    }

    
    // 获取全部小区
    $scope.reloadMap=function(type){
        $http.post($Factory.Community.query.url+'?type='+type).then(function(resData){
            $scope.render(resData.data)
        })
    }
    $scope.reloadMap(1)
    
    $scope.render=function(xy){
        // 百度地图API功能
        var map = new BMap.Map("house_on_map_baidumap");    // 创建Map实例
        map.centerAndZoom(new BMap.Point(118.180242,24.488324), 11);  // 初始化地图,设置中心点坐标和地图级别
        
        map.addControl(new BMap.NavigationControl({enableGeolocation:true}));
        map.addControl(new BMap.OverviewMapControl());
        map.setCurrentCity("厦门");          // 设置地图显示的城市 此项是必须设置的
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        
        // 解决点击失效问题
        map.disableDragging();
        $('#house_on_map_baidumap').on('touchstart', function (e) {
            map.disableDragging();
        });               
        $('#house_on_map_baidumap').on('touchmove', function (e) {
            map.enableDragging();
        });
        $('#house_on_map_baidumap').on('touchend', function (e) {
            map.disableDragging();
        })               
        
        var markers = [];
        var pt = null;
        for (var i in xy) {
            pt = new BMap.Point(xy[i].Longitude , xy[i].Latitude);        
            var marker = new BMap.Marker(pt)
            marker.province = '福建'
            marker.city = xy[i].City
            marker.district = xy[i].District
            marker.street = xy[i].Street
            marker.id = xy[i].Id
            marker.communityName = xy[i].Name ||'优质小区'
            marker.housecount = xy[i].Count
            
            markers.push(marker);
        }
        //最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
        var markerClusterer = new BMapLib.MarkerClusterer(map,
            {
                markers:markers,
                girdSize : 100,
                styles : [{
                    size: new BMap.Size(80,80),
                    backgroundColor : '#FFD202',
                    // backgroundColor : '#F3F3F3',
                    textColor:'#333'
                }],
            });
        markerClusterer.setMaxZoom(13);
        // important 一个Mark可以包含点的范围
        markerClusterer.setGridSize(100);
    }


})