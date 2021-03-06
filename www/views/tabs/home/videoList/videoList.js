
angular.module('App').controller('videoListCtl',function(appUtils,$scope){
	$scope.back=function(){
		appUtils.back();
	}

	var transObject = function(tableData, keys) {
		let hashTable = {}, res = []
		for (let i = 0; i < tableData.length; i++) {
		  let arr = res, cur = hashTable
		  console.log('arr',arr,'cur',cur)
		  for (let j = 0; j < keys.length; j++) {
			let key = keys[j], filed = tableData[i][key]
			console.log(key,filed)
			if (!cur[filed]) {
			  let pusher = {
				value: filed
			  }, tmp
			  if (j !== (keys.length - 1)) {
				tmp = []
				pusher.children = tmp
			  }
			  cur[filed] = { $$pos: arr.push(pusher) - 1 }
			  cur = cur[filed]
			  arr = tmp
			} else {
			  cur = cur[filed]
			  arr = arr[cur.$$pos].children
			}
		  }
		}
		return res
	}
	var data = [{
		"province": "浙江",
		"city": "杭州",
		"name": "西湖"
	}, {
		"province": "四川",
		"city": "成都",
		"name": "锦里"
	}, {
		"province": "四川",
		"city": "成都",
		"name": "方所"
	}, {
		"province": "四川",
		"city": "阿坝",
		"name": "九寨沟"
	}]
	var keys = ['province', 'city', 'name']
	console.table(transObject(data,keys))
})
