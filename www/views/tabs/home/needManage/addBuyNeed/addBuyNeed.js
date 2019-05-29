angular.module('App')
.controller('addBuyNeedCtl',function(appUtils,$addBuyNeedData,enterViewLoad,$ionicScrollDelegate,$ionicModal,$stateParams,$timeout,$state,$Factory,$http,$scope){
	$scope.back=function(){
		appUtils.back();
	}
	
	// 价格
	$scope.initRange=function(){
		$("#add_need_buy_price_range").ionRangeSlider({
			type: "double",
			min: 0,
			max: 1000,
			from: $scope.needInfo?$scope.needInfo.MinPrize:0,
			to: $scope.needInfo?$scope.needInfo.MaxPrize:1000,
			postfix: "万"
		});
		$scope.rangePriceData = $("#add_need_buy_price_range").data("ionRangeSlider");
		$("#add_need_buy_space_range").ionRangeSlider({
			type: "double",
			min: 0,
			max: 1000,
			from: $scope.needInfo?$scope.needInfo.MinSpace:0,
			to: $scope.needInfo?$scope.needInfo.MaxSpace:1000,
			postfix: "m²"
		});
		$scope.rangeSpaceData = $("#add_need_buy_space_range").data("ionRangeSlider");
	}
	
	// 编辑
	if($stateParams.id){
		$http.get($Factory.HouseNeed.detail.url,{params:{id:$stateParams.id}})
			.then(function(res){
				$scope.needInfo=res.data;

				$scope.addSubData=res.data;
				$scope.addSubData.CityId=res.data.CityId;
				$scope.addSubData.City=res.data.City;

				$scope.initData()
				$scope.initRange() //range输入框
			}).catch(function(err){
				$scope.initRange() //range输入框
			})
	}else{
		console.log(1)
		$scope.initRange() //range输入框
	}


	$scope.$on('$ionicView.enter',function(){
		$scope.addSubData=$addBuyNeedData.data;
		$scope.addSubData.CityId=appUtils.city.id;
		$scope.addSubData.City=appUtils.city.name;

		$scope.initData()		
	})
	
	$scope.initData=function(){
		var districtList,defDsitrict
		districtList=[],defDsitrict='思明'
		switch($scope.addSubData.City){
			case '厦门':
				districtList=['思明','湖里','集美','海沧','同安','翔安','其他']
				defDsitrict='湖里'
				break
			case '漳州':
				districtList=['芗城区','龙文区','龙海市','南靖县','诏安县','漳浦县','华安县','东山县','长泰县','云霄县','其他']
				defDsitrict='龙海市'
				break
			case '泉州':
				districtList=['鲤城区','丰泽区','洛江区','泉港区','石狮市','晋江市','南安市','惠安县','永春县','安溪县','德化县','金门县','其他']
				defDsitrict='泉港区'
				break
			case '福州':
				districtList=['鼓楼区','台江区','仓山区','马尾区','晋安区','福清市','长乐市','闽侯县','闽清县','永泰县','连江县','罗源县','平潭县','其他']
				defDsitrict='鼓楼区'
				break
			case '宁德':
				districtList=['蕉城区','福安市','福鼎市','寿宁县','霞浦县','柘荣县','屏南县','古田县','周宁县','其他']
				defDsitrict='霞浦县'
				break
			case '莆田':
				districtList=['城厢区','涵江区','荔城区','秀屿区','仙游县','其他']
				defDsitrict='仙游县'
				break
			case '龙岩':
				districtList=['新罗区','漳平市','长汀县','武平县','上杭县','永定县','连城县','其他']
				defDsitrict='长汀县'
				break
			case '三明':
				districtList=['梅列区','三元区','永安市','明溪县','将乐县','大田县','宁化县','建宁县','沙县','尤溪县','清流县','泰宁县','其他']
				defDsitrict='沙县'
				break
			case '南平':
				districtList=['延平区','建瓯市','邵武市','武夷山市','建阳市','松溪县','光泽县','顺昌县','浦城县','政和县','其他']
				defDsitrict='武夷山市'
				break
			case '中山':
				districtList=['中山']
				defDsitrict='中山'
				break
			default:
				districtList=['不限','思明','湖里','集美','海沧','同安','翔安']
				defDsitrict='思明'
				break
		}
		$.scrEvent({
			data: districtList,   
			evEle: '.buy-need-district',            
			title: '请选择区域',            
			defValue: defDsitrict,             
			afterAction: function (data) {   
				$(".buy-need-district").val(data);
				$scope.addSubData.District=data;
			}
		});

		//房型
		$.scrEvent3({
			data: [0,1,2,3,4,5,6,7,8,9],
			data2: [0,1,2,3,4,5,6,7,8,9],
			data3: [0,1,2,3,4,5,6,7,8,9],
			evEle: '.buy-need-room-num',
			title: '选择户型',
			defValue: 1,
			defValue2: 1,
			defValue3: 1,
			eleName: '室',
			eleName2: '厅',
			eleName3: '卫',
			afterAction: function (data1, data2,data3){
				$timeout(function(){
					$scope.addSubData.RoomType=data1;
					$scope.addSubData.HallType=data2;
					$scope.addSubData.BathType=data3;
				})
			}
		});
	}
	
	
	

	$scope.save=function(){
		// 	MinPrize: null,
	// 	MaxPrize: null,
	// 	MinSpace: null,
	// 	MaxSpace: null,
		$scope.addSubData.MinPrize=$scope.rangePriceData.old_from
		$scope.addSubData.MaxPrize=$scope.rangePriceData.old_to
		$scope.addSubData.MinSpace=$scope.rangeSpaceData.old_from
		$scope.addSubData.MaxSpace=$scope.rangeSpaceData.old_to
		
		if($scope.pageType==17||$scope.pageType==7||$scope.pageType==9){
			$scope.addSubData.RoomType=null;
			$scope.addSubData.HallType=null;
			$scope.addSubData.BathType=null;
			$scope.addSubData.CommunityId=null;
		}else if($scope.pageType==5||$scope.pageType==11){
			$scope.addSubData.RoomType=null;
			$scope.addSubData.HallType=null;
			$scope.addSubData.BathType=null;
		}
		
		
	   $http.post($Factory.HouseNeed.save.url,$scope.addSubData).then(function(resData){
		   $scope.deleteSubData=true;
		   enterViewLoad.customload('发布成功')
		   $timeout(function(){
			   $scope.back()
		   },1000)
		   $addBuyNeedData.data={
			Type:1,
			RoomType:1,
			HallType:1,
			BathType:1,
			District:'',
			MinPrize: null,
			MaxPrize: null,
			MinSpace: null,
			MaxSpace: null,
			CommunityId: null,
			CommunityName:'',
			City: '',
			CityId:null,
			Attach:'',//具体需求
			Address:'',//地址
		}
	   }).catch( function(resData){
			enterViewLoad.customload("提交失败")
	   });
	}
})
.factory('$addBuyNeedData', [function () {
	/* util 构造函数 */
	var Util = function () {	
	};
	/* util 原型对象 */
	Util.prototype = {
		data:{
			Type:1,
			RoomType:1,
			HallType:1,
			BathType:1,
			District:'',
			MinPrize: null,
			MaxPrize: null,
			MinSpace: null,
			MaxSpace: null,
			CommunityId: null,
			CommunityName:'',
			City: '',
			CityId:null,
			Attach:'',//具体需求
			Address:'',//地址
		}
	};
	return new Util();
}]);