angular.module('App').controller('guessPriceCtl',function(upImgBase,enterViewLoad,appUtils,$http,$Factory,$state,$stateParams,$scope,$rootScope,$timeout){
	$scope.back=function(){
		appUtils.back();
	};

	$rootScope.$on('guesspriceCommunityChange',function(target,value){
		$scope.subData.query=value
	})
	$scope.subData={
		query:'',
		type:1,//1二手 2租房
		level:4,//1市区 2区域 3街道 4小区 null模糊
		orientation:'',
		houseType:'',
		space:''
	}


	$http.get('sellHouseData.json').then(function(resData){	
		//房型
	    $.scrEvent3({
	        data: [0,1,2,3,4,5,6,7,8,9],
	        data2: [0,1,2,3,4,5,6,7,8,9],
	        data3: [0,1,2,3,4,5,6,7,8,9],
	        evEle: '.guess-huxing',
	        title: '选择户型',
	        defValue: 1,
	        defValue2: 1,
	        defValue3: 1,
	        eleName: '室',
	        eleName2: '厅',
	        eleName3: '卫',
	        afterAction: function (data1, data2,data3) {
	          $('.guess-huxing').val(data1 + '室' + data2 + '厅'+data3+'卫');
			  $scope.subData.houseType=data1 + '室' + data2 + '厅'+data3+'卫';
			  
	        }
		});

		$scope.chaoxiang=resData.data.HouseStatus.Orientation;
		$scope.chaoxiangarr=[]
		for(var i=0;i<$scope.chaoxiang.length;i++){
			$scope.chaoxiangarr.push($scope.chaoxiang[i].text)
		}	
	    $.scrEvent({
	      	data: $scope.chaoxiangarr, 
	      	evEle: '.guess-chaoxiang',          
	      	title: '选择朝向',           
	      	defValue: '东',           
			afterAction: function (data) {
				$(".guess-chaoxiang").val(data);
				$scope.subData.orientation=data;
			}
		});
	})

	$scope.submitData=function(){
		if(!$scope.subData.query){
			enterViewLoad.customload('请选择小区')
			return
		}
		if(!$scope.subData.space){
			enterViewLoad.customload('请输入面积')
			return
		}
		$state.go('tabs.systemPrice',{query:$scope.subData.query,space:$scope.subData.space})
	}
	
})