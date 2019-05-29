
angular.module('App').controller('cityChooseCtl',function(appUtils,enterViewLoad,$rootScope,$ionicScrollDelegate,$timeout,$http,$Factory,$scope){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.hotCitys=[
		{name:'厦门',id:1},
		{name:'漳州',id:2},
		{name:'泉州',id:3},
		{name:'福州',id:4},
		{name:'宁德',id:5},
		{name:'莆田',id:6},
		{name:'龙岩',id:7},
		{name:'三明',id:8},
		{name:'南平',id:9},
		{name:'中山',id:200},
	]
	$scope.currentCity = appUtils.city.name;
	$scope.getLocation=function(){
		appUtils.bMapLocation(function(result){
			// result.city
			$scope.currentCity = result.city;
		},function(err){
			enterViewLoad.customload('获取定位失败')
		})
	}

	$scope.chooseCity = function(city){
		for(var i=0;i<$scope.hotCitys.length;i++){
			if(city == $scope.hotCitys[i].name){
				appUtils.city.name=$scope.hotCitys[i].name
				appUtils.city.id = $scope.hotCitys[i].id

				// 全局区域变化选择 
				$http.post($Factory.Community.cities.url+'?city='+$scope.hotCitys[i].id).then(function(res){
					appUtils.currentDistricts=res.data[$scope.hotCitys[i].name]
				})
				$rootScope.$emit('appUtilsCityChange',appUtils.city);
				$scope.back()
				return
			}
		}
		enterViewLoad.customload('当前城市暂未开放服务')
	}

	
	
	$scope.$on('$ionicView.enter',function(){
		if(!$scope.initStatus){
			$scope.initData()
		}
	})
	$scope.initStatus = false;
	$scope.initData=function(){
		/*
		*城市列表
		*/ 
		$scope.formatCitys=[{key:'A',value:[]},{key:'B',value:[]},
						{key:'C',value:[]},{key:'D',value:[]},
						{key:'E',value:[]},{key:'F',value:[]},
						{key:'G',value:[]},{key:'H',value:[]},
						{key:'I',value:[]},{key:'J',value:[]},
						{key:'K',value:[]},{key:'L',value:[]},
						{key:'M',value:[]},{key:'N',value:[]},
						{key:'O',value:[]},{key:'P',value:[]},
						{key:'Q',value:[]},{key:'R',value:[]},
						{key:'S',value:[]},{key:'T',value:[]},
						{key:'U',value:[]},{key:'V',value:[]},
						{key:'W',value:[]},{key:'X',value:[]},
						{key:'Y',value:[]},{key:'Z',value:[]},
						{key:'#',value:[]}];	
		/*评音转字母*/
		$scope.changeToPinyinArr=function(){
			for(var i=0;i<$scope.resCityList.length;i++){
				var firstLetter=pinyinUtil.getFirstLetter($scope.resCityList[i]).substr(0,1).toUpperCase()

				for(var j=0;j<$scope.formatCitys.length;j++){
					if(firstLetter == $scope.formatCitys[j].key){ 
						$scope.formatCitys[j].value.push($scope.resCityList[i]);  
						break;  
					}
					if(j == $scope.formatCitys.length-1) {
						$scope.formatCitys[26].value.push($scope.resCityList[i]); 
					} 
				}
			}					
		}
		
		// 获取的城市
		$scope.resCityList = []
		$http.get('jsonData/cityChoose/cities.json').then(function(resData){
			$scope.initStatus = true;
			for(var i=0;i<resData.data.length;i++){
				for(var j=0;j<resData.data[i].citys.length;j++){
					var pushData = resData.data[i].citys[j].citysName.substr(0,resData.data[i].citys[j].citysName.length-1);
					$scope.resCityList.push(pushData)
				}
			}
			$scope.changeToPinyinArr()
		}).catch(function(){
			$scope.initStatus = false;
		})
	}
	



	//返回顶部
	$scope.backTop=function(){
		$ionicScrollDelegate.$getByHandle('citychoose-Scroll').scrollTop(true)
	}
	//右侧导航点击跳转
	$scope.letterarr=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","#"]
    $scope.mTouch=function(event,letter){ 
		enterViewLoad.customload(letter,500)
		
	  	var positionX=event.pageX || event.touches[0].pageX;
		var positioinY=event.pageY || event.touches[0].pageY;
		var ele = document.elementFromPoint(positionX,positioinY);  
		if(!ele){
			return;
		}
		var c=ele.innerText;
		if(!c || c==" " || c.length!=1){
			return;
		}
		$scope.hint=c; 
		
		if(document.getElementById("city_choose_index-"+$scope.hint)){
			var scroll = document.getElementById("city_choose_index-"+$scope.hint).offsetTop - $ionicScrollDelegate.$getByHandle("citychoose-Scroll").getScrollPosition().top; 	  	
		}else{
			return
		}
		$ionicScrollDelegate.scrollBy(0,scroll,true);
		var ele = document.getElementsByTagName("ion-content");  
		ele[0].style.overflow="auto";  //解决滑动右边的导航字母后，左边不能再滚动的
	};
})
