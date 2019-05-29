
angular.module('App').controller('addNewCtl',function(enterViewLoad,$addNewData,upImgBase,appUtils,$ionicScrollDelegate,$ionicModal,$timeout,$http,$Factory,$scope,$rootScope,$stateParams){
	$scope.back=function(){
		appUtils.back();
	}
	
	$scope.type = $stateParams.type;
	$scope.headtitle = '一手房新增';		
	
	// 软键盘弹出 页面滚动
	$scope.scrollTo=function(to){
		$ionicScrollDelegate.scrollTo(0, to || 0, true)
	}
	$scope.addNewScrollListing=function(){
		$scope.currentTop = $ionicScrollDelegate.getScrollPosition().top;
		$addNewData.scrollTo = $scope.currentTop
	}
	window.addEventListener('native.keyboardshow',function(e){
		$scope.scrollTo($scope.currentTop)
	})

	$scope.$on('$ionicView.enter',function(){
		$scope.initData()
		$scope.scrollTo($addNewData.scrollTo)
	})
	$scope.initData = function(){
		$http.get($Factory.Account.hjson.url).then(function(resData){		
			$scope.chaoxiang=resData.data.Bounds;
			$scope.chaoxiangarr=[]
			for(var i=0;i<$scope.chaoxiang.length;i++){
				$scope.chaoxiangarr.push($scope.chaoxiang[i].text)
			}	
			$.scrEvent({
				  data: $scope.chaoxiangarr,   
				  evEle: '.qu-chaoxiang',            
				  title: '请选择朝向',            
				  defValue: '东',             
				afterAction: function (data) {   
					$(".qu-chaoxiang").val(data);
					$scope.addNewSubData.Orientation=data;
				}
			});
			$.scrEvent({
				  data: ['按千分比','按现金'],   
				  evEle: '.addnew-commisiontype',            
				  title: '请选择佣金类型',            
				  defValue: '按千分比',             
				afterAction: function (data) {  
					$(".addnew-commisiontype").val(data); 
					$scope.addNewShowData.CommisionType=data;
					switch(data)
					{
						case '按千分比':
							$scope.addNewSubData.CommisionType=1;
							break;
						case '按现金':
							$scope.addNewSubData.CommisionType=2;
							break;
						default:
							break;
					}
					
				}
			});
			// 房期
			$scope.houseperiod=resData.data.HousePeriod;
			$scope.houseperiodarr=[]
			for(var i=0;i<$scope.houseperiod.length;i++){
				$scope.houseperiodarr.push($scope.houseperiod[i].text);
			}
			$.scrEvent({
				data: $scope.houseperiodarr,   
				evEle: '.addnew-houseperiod',            
				title: '请选择房期',            
				defValue: '现房',             
				afterAction: function (data) { 
					$(".addnew-houseperiod").val(data);
					$scope.addNewSubData.HousePeriodName=data;
					switch(data)
					{
					case "期房":
						$scope.addNewSubData.HousePeriod=1
						break;
					case "现房":
						$scope.addNewSubData.HousePeriod=2
						break;
					case "待售":
						$scope.addNewSubData.HousePeriod=3
						break;
					case "尾盘":
						$scope.addNewSubData.HousePeriod=4
						break;
					default:
						break;
					}  
				}
			});
		
			//楼层
			var louceng=resData.data.FloorOptions;
			var loucengarr=[]
			for(var i=0;i<louceng.length;i++){
				loucengarr.push(louceng[i].text)
			}
			$.scrEvent2({
				data: loucengarr,
				data2: loucengarr,
				evEle: '.qu-louceng',
				title: '楼层',
				defValue: 1,
				defValue2: 1,
				eleName: '层 ',
				eleTotal: '共',
				eleNo:'第',
				eleName2: '层',
				afterAction: function (data1, data2) {
				  $('.qu-louceng').val(data1 + '/' + data2);
				  $scope.addNewSubData.Floor=data1;
				  $scope.addNewSubData.TotalFloor=data2;
				  $scope.addNewShowData.louCeng=data1 + '/' + data2;
				}
			});
			
			//房型
			var fangxing=resData.data.RoomTypes.customData;
			var shi=fangxing.y;
			var ting=fangxing.m;
			var wei=fangxing.d;
			var shiarr=[]
			var tingarr=[]
			var weiarr=[]
			for(var i=0;i<shi.length;i++){
				shiarr.push(shi[i].text)
			}
			for(var i=0;i<ting.length;i++){
				tingarr.push(ting[i].text)
			}
			for(var i=0;i<wei.length;i++){
				weiarr.push(wei[i].text)
			}
			$.scrEvent3({
				data: shiarr,
				data2: tingarr,
				data3: weiarr,
				evEle: '.qu-fangxing',
				title: '房型',
				defValue: 1,
				defValue2: 1,
				defValue3: 1,
				eleName: '室',
				eleName2: '厅',
				eleName3: '卫',
				afterAction: function (data1, data2,data3) {
				  $('.qu-fangxing').val(data1 + '室' + data2 + '厅'+data3+'卫');
				  $scope.addNewSubData.RoomType=data1;
				  $scope.addNewSubData.HallType=data2;
				  $scope.addNewSubData.BathType=data3;
				  $scope.addNewShowData.fangXing=data1 + '室' + data2 + '厅'+data3+'卫';
				  
				}
			});
				
			//类型
			var leixing=resData.data.BuildingTypes;
			var leixingarr=[];
			for(var i=0;i<leixing.length;i++){
				leixingarr.push(leixing[i].text)
			}
			$.scrEvent({
			  data: leixingarr,   
			  evEle: '.qu-leixing',            
			  title: '',            
			  defValue: '普通住宅',             
			  afterAction: function (data) {  
				$(".qu-leixing").val(data);
				$scope.addNewSubData.BuildType=data;
			  }
			});
			
			//装修
			var zhuangxiu=resData.data.Fitments;
			var zhuangxiuarr=[];
			for(var i=0;i<zhuangxiu.length;i++){
				zhuangxiuarr.push(zhuangxiu[i].text)
			}
			$.scrEvent({
				  data: zhuangxiuarr,   
				  evEle: '.addnew-zhuangxiu',
				  title: '装修', 
				  defValue: '豪装',  
				  afterAction: function (data) { 
					$(".addnew-zhuangxiu").val(data); 
					$scope.addNewSubData.DecorateSituationName=data;
					switch(data)
					{
					case "豪装":
						$scope.addNewSubData.DecorateSituation=1
						break;
					case "精装":
						$scope.addNewSubData.DecorateSituation=2
						break;
					case "中装":
						$scope.addNewSubData.DecorateSituation=3
						break;
					case "简装":
						$scope.addNewSubData.DecorateSituation=4
						break;
					case "毛坯":
						$scope.addNewSubData.DecorateSituation=4
						break;
					default:
						break;
					}
				  }
			});
			$.scrEvent({
				  data: resData.data.NewBuildingTypes,   
				  evEle: '.addnew-buildingtype',
				  title: '建筑类型', 
				  defValue: 'SOHO',  
				  afterAction: function (data) { 
					$(".addnew-buildingtype").val(data);
					$scope.addNewSubData.BuildingType=data;
				  }
			});
			
			//年代
			var niandai=resData.data.YearOptions;
			var niandaiarr=[];
			for(var i=0;i<niandai.length;i++){
				niandaiarr.push(niandai[i].text)
			}
			$.scrEvent({
				data:niandaiarr,   
				evEle: '.qu-niandai',  
				title: '年代',            
				defValue: 1995,             
				afterAction: function (data) {   
					$(".qu-niandai").val(data);
					$scope.addNewSubData.Year=data;
				  }
			});
			// 开盘时间
			$.scrEvent3({
				data: niandaiarr,
				data2: resData.data.MonthArr,
				data3: resData.data.DateArr,
				evEle: '.addnew-opentime',
				title: '开盘时间',
				defValue: 1995,
				defValue2: 1,
				defValue3: 1,
				eleName: '年',
				eleName2: '月',
				eleName3: '日',
				afterAction: function (data1, data2,data3) {
					$(".addnew-opentime").val(data1 + '/' + data2 + '/'+data3);
					  $scope.addNewSubData.OpenTime=data1 + '/' + data2 + '/'+data3;
				}
			});
			// 交房时间
			$.scrEvent3({
				data: niandaiarr,
				data2: resData.data.MonthArr,
				data3: resData.data.DateArr,
				evEle: '.addnew-deliverdate',
				title: '交房时间',
				defValue: 1995,
				defValue2: 1,
				defValue3: 1,
				eleName: '年',
				eleName2: '月',
				eleName3: '日',
				afterAction: function (data1, data2,data3) {
					$(".qu-niandai").val(data1 + '/' + data2 + '/'+data3);
					  $scope.addNewSubData.DeliverDate=data1 + '/' + data2 + '/'+data3;
				}
			});
	
			//城市
			var chengshi=resData.data.Cities;
			var chengshiarr=[];
			for(var i=0;i<chengshi.length;i++){
				chengshiarr.push(chengshi[i].text)
			}
			$.scrEvent({
				data:chengshiarr,   
				evEle: '.addnew-city',           
				title: '城市',            
				defValue: '厦门',           
				afterAction: function (data) { 
					$(".addnew-city").val(data); 
					$scope.addNewSubData.CityName=data;
					$addNewData.city=data
					switch(data)
					{
					case "厦门":
						appUtils.city=$scope.addNewSubData.City=1
						break;
					case "漳州":
						appUtils.city=$scope.addNewSubData.City=2
						break;
					case "泉州":
						appUtils.city=$scope.addNewSubData.City=3
						break;
					case "福州":
						appUtils.city=$scope.addNewSubData.City=4
						break;
					case "宁德":
						appUtils.city=$scope.addNewSubData.City=5
						break;
					case "莆田":
						appUtils.city=$scope.addNewSubData.City=6
						break;
					case "龙岩":
						appUtils.city=$scope.addNewSubData.City=7
						break;
					case "三明":
						appUtils.city=$scope.addNewSubData.City=8
						break;
					default:
						appUtils.city=$scope.addNewSubData.City=1
						break;
					}
				  }
			});
		})
	}
		
	
		
	if($stateParams.id>0){
		$http.get($Factory.NewHouse.getdetail.url,{params:{id:$stateParams.id}}).then(function(resData){
			if($addNewData.data && $addNewData.data.Id == resData.data.Id){
				$scope.addNewSubData = $addNewData.data;
				$scope.addNewShowData = $addNewData.showData;
			}else{
				$scope.addNewSubData=resData.data;
				$scope.addNewShowData={CommisionType:''}
				switch(resData.data.CommisionType)
					{
						case 1:
							$scope.addNewShowData.CommisionType='按千分比'
							break;
						case 2:
							$scope.addNewShowData.CommisionType='按现金'
							break;
						default:
							break;
					}
			}
		})
	}else{
		if($addNewData.data && !$addNewData.data.Id){
			$scope.addNewSubData = $addNewData.data;
			$scope.addNewShowData = $addNewData.showData;
		}else{
			$scope.addNewShowData={
				CommisionType:'按千分比'
			}
			$scope.addNewSubData={
				Id: null,
				BuildingImg:[],
				ShowBuildingImg:[],
				HouseRoomSpaces: [],
				NewHouseName: "",
				LandAgent: "",
				City: null,
				CityName: "",
				HousePeriod: null,
				HousePeriodName: "",
				Price: null,
				OpenTime: "",
				DeliverDate: "",
				DecorateSituation: null,
				DecorateSituationName: "",
				PlotRatio: null,
				BuildingType: "",
				NumberOfHouseholds: null,
				Green: "",
				Description: "",
				SupportingFacilities: "",
				Address: "",
				Longitude: null,
				Latitude: null,
				CommisionType: 1,
				Commision: null,
				CommisionName: "",
				Users:[]
			}
		}

	}

	// 图片图库获取
	$scope.photoChoose = function(){ 
		var args = {
			'selectMode': 100, //101=picker image and video , 100=image , 102=video
			'maxSelectCount': 9, //default 40 (Optional)
			'maxSelectSize': 188743680, //188743680=180M (Optional)
		};
		appUtils.photoLiberary(args,function(base,orientation){
			$http.post( $Factory.Account.upload.url,{
					path:'18/HouseSource/new',
					file:base,
					orientation:orientation
			}).then(function(resData){
				if(resData.data.error==0){
					$scope.addNewSubData.BuildingImg.push(resData.data.url)
					$scope.addNewSubData.ShowBuildingImg.push(resData.data.view);
				}
			}).catch(function(){
				enterViewLoad.customload('图片上传失败')
			})
		},function(err){
			enterViewLoad.customload('获取图片失败')
		})
	}

	// 楼盘图片相机获取
	$scope.indoorCameraBase = function(){
		var options = {
			width:1000,
			height:1000
		}
		appUtils.cameraBase(options,function(base){
			$http.post($Factory.Account.upload.url,{
				path:'18/HouseSource/new',
				file:base
			}).then(function(resData){
				if(resData.data.error==0){
					$scope.addNewSubData.BuildingImg.push(resData.data.url);
					$scope.addNewSubData.ShowBuildingImg.push(resData.data.view);
				}
			})
		},function(err){
			enterViewLoad.customload('调用相机失败')
		})
	}
	

	// 房型图片图库获取
	$scope.onePhotoChoose = function(index){ 
		var args = {
			'selectMode': 100, //101=picker image and video , 100=image , 102=video
			'maxSelectCount': index >= 0 ? 1 : 3, //修改一张 选择 三张
			'maxSelectSize': 188743680, //188743680=180M (Optional)
		};
		appUtils.photoLiberary(args,function(base,orientation){
			$http.post($Factory.Account.upload.url,{
				path:'18/HouseSource/new',
				file:base,
				orientation:orientation
			}).then(function(resData){
				if(resData.data.error==0){
					if(index >= 0){
						// 修改
						$scope.addNewSubData.HouseRoomSpaces[index].Image=resData.data.url;
						$scope.addNewSubData.HouseRoomSpaces[index].ShowImage=resData.data.view;
					}else{
						// 新增
						$scope.addhouseRoomData=  {
							Space: null,
							RoomType: null,
							HallType: null,
							BathType: null,
							Image: resData.data.url,
							ShowImage: resData.data.view,
							SaleStatus: 0,
							NewsHouseId: null,
							Id: null
						}
						$scope.addNewSubData.HouseRoomSpaces.push($scope.addhouseRoomData);
					}
				}
			}).catch(function(){
				enterViewLoad.customload('图片上传失败')
			})
		},function(err){
			enterViewLoad.customload('获取图片失败')
		})
	}
	// 房型图片相机获取
	$scope.huxingCameraBase = function(){
		var options = {
			width:1000,
			height:1000
		}
		appUtils.cameraBase(options,function(base){
			$http.post($Factory.Account.upload.url,{
				path:'18/HouseSource/new',
				file:base
			}).then(function(resData){
					if(resData.data.error==0){
						$scope.addhouseRoomData=  {
							Space: null,
							RoomType: null,
							HallType: null,
							BathType: null,
							Image: resData.data.url,
							ShowImage: resData.data.view,
							SaleStatus: 0,
							NewsHouseId: null,
							Id: null
						}
						$scope.addNewSubData.HouseRoomSpaces.push($scope.addhouseRoomData);
					}
				})
		},function(err){
			enterViewLoad.customload('调用相机失败')
		})
	}
	

	//点击叉号去除
	$scope.remove=function(index){
		$scope.addNewSubData.ShowBuildingImg.splice(index,1);
		$scope.addNewSubData.BuildingImg.splice(index,1);
	}
	// 叉除户型
	$scope.reduceHuxing=function(index){
		$scope.addNewSubData.HouseRoomSpaces.splice(index,1);
	}
	// sort 图片
	Sortable.create(document.getElementById('addNew_sortindoor_img'), {
        group: {
            name:"otherwords",
            pull: 'clone',
            put: true 
        },
        animation: 150, //动画参数
        onAdd: function (evt){ 
        },
        onUpdate: function (evt){  
        },
        onRemove: function (evt){ 
        },
        onStart:function(evt){ 
        },
        onSort:function(evt){ 
        },
		onEnd: function(evt){ 
			$timeout(function(){
				var waitImgItem=$scope.addNewSubData.BuildingImg[evt.oldIndex]
				var waitShowImgItem=$scope.addNewSubData.ShowBuildingImg[evt.oldIndex]
				$scope.addNewSubData.BuildingImg.splice(evt.oldIndex,1)
				$scope.addNewSubData.ShowBuildingImg.splice(evt.oldIndex,1);
				// 新增
				$scope.addNewSubData.BuildingImg.splice(evt.newIndex,0,waitImgItem)
				$scope.addNewSubData.ShowBuildingImg.splice(evt.newIndex,0,waitShowImgItem);
			})
		}
    });
	
	  
	$ionicModal.fromTemplateUrl('newGoLogin-modal', {
		scope: $scope,
		animation: 'slide-in-up'
		}).then(function(modal) {
		$scope.modal = modal;
		});
	$scope.closeModal=function(){
		$scope.modal.hide();
	}
	
	$scope.publish=function(){
		// if(!$scope.addNewSubData.NewHouseName||$scope.addNewSubData.BuildingImg.length<1||$scope.addNewSubData.HouseRoomSpaces.length<1||!$scope.addNewSubData.CityName||!$scope.addNewSubData.HousePeriodName
		// 	||!$scope.addNewSubData.Price||!$scope.addNewSubData.OpenTime||!$scope.addNewSubData.DeliverDate||!$scope.addNewSubData.DecorateSituationName||!$scope.addNewSubData.BuildingType
		// 	||!$scope.addNewSubData.NumberOfHouseholds||!$scope.addNewSubData.Green||!$scope.addNewSubData.SupportingFacilities||!$scope.addNewSubData.Address||!$scope.addNewSubData.CommisionType||!$scope.addNewSubData.Commision){
		// 		enterViewLoad.customload('请将信息填写完整')
		// 		return
		// }
		if(!$scope.addNewSubData.NewHouseName){
			enterViewLoad.customload('请输入房源名称')	
			return
		}		
		if(!$scope.addNewSubData.Price){
			enterViewLoad.customload('请输均价')	
			return
		}		
		if($scope.addNewSubData.BuildingImg.length<1){
			enterViewLoad.customload('请上传楼盘图片')	
			return
		}		
			
		
		var realSubData = JSON.parse(JSON.stringify($scope.addNewSubData))
		
		$http.post($Factory.NewHouse.postdetail.url,realSubData).then(function(resData){
				$scope.deleteSubData=true;
				$addNewData.scrollTo = 0;
				
				if($stateParams.id>0){
					enterViewLoad.customload('修改成功');
				}else{enterViewLoad.customload('新增成功');}
				$timeout(function(){
					$rootScope.$ionicGoBack();
				},1500)
		}).catch(function(res){
			if(res.status==400){
				$scope.modalType='realname';
				$scope.modal.show();
			}
			else if(res.status==401){
				$scope.modalType='login';
				$scope.modal.show();
			}
			else if(res.status==500){
				enterViewLoad.customload('请将信息填写完整');
			}
		})
							
	}	
	
	$scope.$on('$ionicView.beforeLeave',function(event,data){
		if(!$scope.deleteSubData){
			$addNewData.data = $scope.addNewSubData;	
			$addNewData.showData = $scope.addNewShowData;
		}else{
			$addNewData.data = null
			$addNewData.showData = null
		}
	})
		   	   
})
.factory('$addNewData', [function () {
	/* util 构造函数 */
	var Util = function () {
		
	};
	/* util 原型对象 */
	Util.prototype = {
		data:null,
		showData:null,
		scrollTo:null,
		city:null
	};

	return new Util();
}]);