angular.module('App').controller('orderVisitCtl',function(appUtils,enterViewLoad,$localStorage,$timeout,$http,$Factory,$state,$stateParams,$scope,$rootScope,$ionicLoading){
	$scope.back=function(){
		appUtils.back();
	};
	
	$scope.houseId=$stateParams.houseid

	$scope.subData={
		NewHouseId:'',
		ProxerId:null,
		LookTime:''
	}

	$rootScope.$on('chooseOrderHouseSuc',function(event,value){
		$scope.houseId=value.Id
		$http.get($Factory.NewHouse.getdetail.url,{
				params:{id:value.Id}
			}).then(function(resData){
				$scope.houseInfo=resData.data
				$scope.houseInfo.Space=value.Space
			})
	})

	$scope.userinfo=$localStorage.myselfInfo
	$scope.subData.ProxerId=$scope.userinfo.Id
	

	var dateList=[];
	for(var i=0;i<60;i++){
		var dd = new Date();
		dd.setDate(dd.getDate()+i);
		var y = dd.getFullYear();
		var m = dd.getMonth()+1;
		var d = dd.getDate();	
		dateList.push(y+"/"+m+"/"+d)
	}

	$.scrEvent({
		data: dateList,
		evEle: '.sub-order-visit-time',
		title: '看房时间',
		defValue: dateList[1],
		afterAction: function (data1) {
			$('.sub-order-visit-time').val(data1);
			$scope.subData.LookTime=data1;
		}
	});
			

	$scope.radioChoose=0;
	
	$scope.changeRadioType=function(type){
		$scope.radioChoose=type;
		if($scope.radioChoose==0){
			$scope.subData.ProxerId=$scope.userinfo.Id;
		}else{
			$state.go('orderAgentList',{houseid:$stateParams.houseid})
		}
	}
	$rootScope.$on('chooseVisitAgentChange',function(data,value){
		$scope.reload=true;
		$scope.agentInfo=value;
	})
	$scope.$on('$ionicView.enter',function(){
		if($scope.reload){
			$scope.reload=false;
			$scope.subData.ProxerId=$scope.agentInfo.ProxerId;
		}
	})

	$scope.save=function(){
		if($scope.houseInfo&&$scope.houseInfo.IsReserve){
			enterViewLoad.customload('您已预约过该套房源',2000)
			return
		}
		if(!$scope.houseId){
			enterViewLoad.customload('请选择预约房源')
			return
		}
		if(!$scope.subData.LookTime){
			enterViewLoad.customload('请选择时间')
			return
		}
		
		$scope.subData.NewHouseId=$scope.houseId
		$http.post($Factory.NewHouseTrade.wantlook.url,$scope.subData)
		.then(function(res){
			enterViewLoad.customload('提交成功')
			$timeout(function(){
				$scope.back();
			},1500);
		}).catch(function(){
			enterViewLoad.customload('提交失败')
		})
	}
	

})