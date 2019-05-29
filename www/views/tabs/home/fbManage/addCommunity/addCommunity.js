
angular.module('App').controller('addCommunityCtl',function(enterViewLoad,appUtils,$ionicSlideBoxDelegate,$localStorage,$ionicLoading,$ionicHistory,$state,$http,$Factory,$scope,$rootScope,$stateParams,$ionicPopover,$ionicPopup,$timeout){
	$scope.back=function(){
		appUtils.back();
	}
	$scope.showData={
		PropType:'',
	}
	$scope.subData={
		PropType:'',
		City:'',
		CityId:null,
		District:'',
		Street:'',
		Pics:[],
		ShowPics:[],
		Address:''
	}

	$http.get('jsonData/addCommunity/communityArea.json')
	.then(function(resData){
		$.scrEvent({
			data: ['别墅','普通住宅','平房','公寓','其他'], 
			evEle: '.addcom-wuye',         
			title: '选择物业',           
			defValue: '平房',          
			afterAction: function (data) { 
				$(".addcom-wuye").val(data);
				switch(data){
						case '别墅':
							$scope.subData.PropType=2
							break
						case '其他':
							$scope.subData.PropType=4
							break
						case '普通住宅':
							$scope.subData.PropType=9
							break
						case '平房':
							$scope.subData.PropType=12
							break
						case '公寓':
							$scope.subData.PropType=71
							break
						default:
							$scope.subData.PropType=null
							break
				}
			}
		});

		$scope.districtObj=null
		$scope.streetArrs = []
		$scope.districts = []
		$scope.streets = []
		switch(appUtils.city.name){
			case '厦门':
				$scope.districtObj = resData.data.福建省.厦门市
				break
			case '漳州':
				$scope.districtObj = resData.data.福建省.漳州市
				break
			case '泉州':
				$scope.districtObj = resData.data.福建省.泉州市
				break
			case '福州':
				$scope.districtObj = resData.data.福建省.福州市
				break
			case '宁德':
				$scope.districtObj = resData.data.福建省.宁德市
				break
			case '莆田':
				$scope.districtObj = resData.data.福建省.莆田市
				break
			case '龙岩':
				$scope.districtObj = resData.data.福建省.龙岩市
				break
			case '三明':
				$scope.districtObj = resData.data.福建省.三明市
				break
			case '南平':
				$scope.districtObj = resData.data.福建省.南平市
				break
			case '中山':
				$scope.districtObj = resData.data.广东省.中山市
				break
			default:
				$scope.districtObj = resData.data.福建省.厦门市
				break
		}
	
		for(var key in $scope.districtObj){
			$scope.districts.push(key)
			$scope.streetArrs.push($scope.districtObj[key])
		}
		
		
		$.scrEvent({
			data: $scope.districts, 
			evEle: '.addcom-quyu',         
			title: '选择区域',           
			defValue: $scope.districts[0],          
			afterAction: function (data) { 
				$(".addcom-quyu").val(data);
				$scope.subData.District=data;
				$timeout(function(){
					$scope.subData.Street='';
					$(".addcom-jiedao").val('');
				})

				
				$scope.streets = $scope.streetArrs[$scope.districts.indexOf(data)]
				$.scrEvent({
					data: $scope.streets, 
					evEle: '.addcom-jiedao',         
					title: '选择街道',           
					defValue: $scope.streets[0],          
					afterAction: function (data) { 
						$(".addcom-jiedao").val(data);
						$scope.subData.Street=data;
					}
				});
			}
		});

		$.scrEvent({
			data: $scope.streetArrs[0], 
			evEle: '.addcom-jiedao',         
			title: '选择街道',           
			defValue: $scope.streetArrs[0][0],          
			afterAction: function (data) { 
				$(".addcom-jiedao").val(data);
				$scope.subData.Street=data;
			}
		});

	})
		
	// });
	// 图片图库获取
	$scope.photoChoose = function(){ 
		var args = {
			'selectMode': 100, //101=picker image and video , 100=image , 102=video
			'maxSelectCount': 9, //default 40 (Optional)
			'maxSelectSize': 188743680, //188743680=180M (Optional)
		};
		appUtils.photoLiberary(args,function(base,orientation){
			$http.post( $Factory.Account.upload.url,{
					path:'18/addcommunity',
					file:base,
					orientation:orientation
			}).then(function(resData){
				if(resData.data.error==0){
					$scope.subData.Pics.push(resData.data.url)
					$scope.subData.ShowPics.push(resData.data.view);
				}
			}).catch(function(){
				enterViewLoad.customload('图片上传失败')
			})
		},function(err){
			enterViewLoad.customload('获取图片失败')
		})
	}
	// 图片相机获取
	$scope.cameraBase = function(){
		var options = {
			width:1000,
			height:1000
		}
		appUtils.cameraBase(options,function(base){
			$http.post($Factory.Account.upload.url,{
				path:'18/addcommunity',
				file:base
			}).then(function(resData){
				if(resData.data.error==0){
					$scope.subData.Pics.push(resData.data.url)
					$scope.subData.ShowPics.push(resData.data.view);
				}	
			}).catch(function(){
				enterViewLoad.customload('图片上传失败')
			})
		},function(err){
			enterViewLoad.customload('调用相机失败')
		})
	}

	$scope.remove=function(index){
		$scope.subData.Pics.splice(index,1)
		$scope.subData.ShowPics.splice(index,1)
	}

	$scope.save=function(){
		var subData = JSON.parse(JSON.stringify($scope.subData))
		subData.City = appUtils.city.name
		subData.CityId = appUtils.city.id
		$http.post($Factory.Community.add.url,subData).then(function(resData){
			$ionicLoading.show({
				template:'保存成功',
				duration:1500
			});
			$timeout(function(){
				$rootScope.$ionicGoBack();
			},1500)
		}).catch(function(){
			$ionicLoading.show({
				template:'保存失败',
				duration:1500
			});
		})
	}
	
})
