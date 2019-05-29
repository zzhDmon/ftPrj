angular.module('App').controller('visitReportCtl',function(appUtils,enterViewLoad,$timeout,upImgBase,$http,$Factory,$state,$stateParams,$scope,$rootScope,$ionicLoading,$document,$ionicHistory){
	$scope.back=function(){
		appUtils.back();
	};

	$scope.subData={
		NewHouseId:$stateParams.houseid*1,
		Name:'',
		Phone:null,
		LookTime:''
	}
	

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
		evEle: '.order-visit-time',
		title: '时间',
		defValue: dateList[1],
		afterAction: function (data1) {
			$('.order-visit-time').val(data1);
			$scope.subData.LookTime=data1;
		}
	});
	
	$scope.save=function(){
		if(!$scope.subData.Name){
			enterViewLoad.customload('请输入姓名')
			return
		}
		if(!(/^1[34578]\d{9}$/.test($scope.subData.Phone))){ 
			enterViewLoad.customload('请输入正确的手机号码');
	        return false; 
	    } 
		if(!$scope.subData.LookTime){
			enterViewLoad.customload('请选择时间')
			return
		}
		
		$http.post($Factory.NewHouseTrade.visitreport.url,$scope.subData)
			.then(function(res){
				$ionicLoading.show({
					template: '提交成功',
					duration: 1500
				});
				
				$timeout(function(){
					$rootScope.$ionicGoBack();
				},1500);
			}).catch(function(){
				$ionicLoading.show({
					template: '提交失败',
					duration: 1500
				});
			})
	}
	

})