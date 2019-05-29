angular.module('App')
.filter('timeStamp', function () {
	return function (value) {
	  	if (!value){
		 	 return ''
	  	} ;
	  
		var year=new Date(value).getFullYear();
		var month=new Date(value).getMonth()+1;
		var date=new Date(value).getDate();
		var hour=new Date(value).getHours();
		if(new Date(value).getHours()<10){
			var showhour='0'+hour
		}else{
			var showhour=hour
		}
		var minute=new Date(value).getMinutes();
		if(new Date(value).getMinutes()<10){
			var showminute='0'+minute
		}else{
			var showminute=minute
		}
		var second=new Date(value).getSeconds();
		var yearNow=new Date().getFullYear();
		var monthNow=new Date().getMonth()+1;
		var dateNow=new Date().getDate();
		var hourNow=new Date().getHours();
		var minuteNow=new Date().getMinutes();
		var secondNow=new Date().getSeconds();
	
		var result;
		if(year==yearNow&&month==monthNow&&date==dateNow){
			result = showhour+':'+showminute;
		}else if(year==yearNow&&month==monthNow&&date==dateNow-1){
			result = '昨天'+showhour+':'+showminute;
		}else if(year==yearNow&&month==monthNow&&date==dateNow-2){
			result = '前天'+showhour+':'+showminute;
		}else if(year==yearNow){
			result = month+'-'+date;
		}else{
			result = year+'-'+month+'-'+date;
		}
  
	 	return result;
	};
  })
// 聊天时间
.filter('dialogTimeStamp', function () {
	return function (value) {
	  	if (!value){
		 	 return ''
	  	} ;
	  
		var year=new Date(value).getFullYear();
		var month=new Date(value).getMonth()+1;
		var date=new Date(value).getDate();
		var hour=new Date(value).getHours();
		if(new Date(value).getHours()<10){
			var showhour='0'+hour
		}else{
			var showhour=hour
		}
		var minute=new Date(value).getMinutes();
		if(new Date(value).getMinutes()<10){
			var showminute='0'+minute
		}else{
			var showminute=minute
		}
		var second=new Date(value).getSeconds();
		var yearNow=new Date().getFullYear();
		var monthNow=new Date().getMonth()+1;
		var dateNow=new Date().getDate();
		var hourNow=new Date().getHours();
		var minuteNow=new Date().getMinutes();
		var secondNow=new Date().getSeconds();
		var result;
		if(year==yearNow&&month==monthNow&&date==dateNow){
			result = hour+':'+showminute
		}else if(year==yearNow&&month==monthNow&&date==dateNow-1){
			result = '昨天'+hour+':'+showminute
		}else if(year==yearNow&&month==monthNow&&date==dateNow-2){
			result = '前天'+hour+':'+showminute
		}else if(year==yearNow){
			result = month+'-'+date+' '+hour+':'+showminute
		}
		else{
			result = year+'-'+month+'-'+date+' '+hour+':'+showminute
		}
  
	 	return result;
	};
  })
.filter('positionFilter', function () {
	return function (value) {
	  	if (!value){
		 	return ''
		};
		
		var result
		result=value.slice(0,value.indexOf('|'))
	 	return result;
	};
})
.filter('storeFilter', function () {
	return function (value) {
	  	if (!value){
		 	 return ''
		};
		
		var result
		result=value.slice(value.indexOf('|')+1,-1)
	 	return result;
	};
})
//   手机号中间星号表示
  .filter('phoneStarFilter', function () {
	return function (value) {
	  	if (!value){
		 	 return ''
		  } ;
		
		var result
		result=value.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
	 	return result;
	};
})
// 聊天fitlers过滤换行
.filter('nl2br', ['$filter',
    function($filter) {
        return function(data) {
            if (!data) return data;
            return data.replace(/\n\r?/g, '<br />');
        };
    }
])
.filter('findphone', ['$filter',
    function($filter) {
        return function(data) {
			if (!data) return data;
			
			function matchPhoneNum(str,regx){
				var phoneNums = str.match(regx);
				if(phoneNums&&phoneNums.length>0){
					for(var i= 0;i<phoneNums.length;i++){
						//手机号全部替换
						// var a = <a href="tel:">电话</a>
						str = str.replace(phoneNums[i],'<a href="tel:'+phoneNums[i]+'">'+phoneNums[i]+'</a>');
	
						//隐藏手机号中间4位(例如:12300102020,隐藏后为132****2020)
						// var temp  = phoneNums[i]
						// temp = temp.replace(/(\d{3})\d{4}(\d{4})/,'$1****$2');
						// console.log("temp:"+temp);
						// str = str.replace(phoneNums[i],temp);
					}
				}
				return str;
			};
			var regx = /(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})/g; 
			// var str = "ka13213213211323213213213213213213213213213213213212ndsajkjksad113200102222sdas13500000000adsadsadsa";
			var str = data;
			var strresult = matchPhoneNum(str,regx);
            return strresult;
        };
    }
])
// 卡号保留后四位
.filter('cardNoFilter', function () {
	return function (value) {
	  	if (!value){
		 	 return ''
		  } ;
		
		var result
		result=value.slice(-4)
	 	return result;
	};
})
// 文字过滤表情
.filter("emojiFilter",['NimUtils',function(NimUtils){
    return function(text){
        var emojiList = NimUtils.emojiList()
        for (var key in emojiList) {
            var item = emojiList[key]
            var replaceFrom='\\['+key.slice(1,-1)+'\\]'
            var replaceTo="<img src='"+item.img+"' alt=''>"
            text = text.replace(new RegExp(replaceFrom,'g'),replaceTo)
        }
        return text;
    }
}])
// 聊天视频路径
.filter("dialogTrustUrl", ['$sce', function ($sce) {
    return function (recordingUrl){
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}])
// 聊天视频时间
.filter("dialogVideoTimeFilter", [function () {
    return function (time){
        if(time>=60000){
			var min = parseInt(time/60000)
			var sec = parseInt((time%60000)/1000)
			if(min<10){
				min = '0' + min
			}
			if(sec<10){
				sec = '0'+ sec
			}
			time = min+':'+sec
		}else{
			var sec = parseInt(time/1000)
			if(sec<10){
				sec = '0'+ sec
			}
			time = '00:'+sec
		}
		return time
    };
}])
// 交易记录 金额过滤
.filter("feeNumFilter", [function () {
    return function (fee){
		var result
		if(!fee){
			result = (0).toFixed(2)
		}else if(fee>0){
			result = '+'+(fee / 100).toFixed(2)
		}else if(fee<0){
			result = (fee / 100).toFixed(2)
		}else{
			result = fee.toFixed(2)
		}
        return result;
    };
}])
// 价格保留两位小数
.filter("priceFilter", [function () {
    return function (fee){
		var result
		if(!fee){
			result = (0).toFixed(2)
		}else if(fee>0){
			result = fee.toFixed(2)
		}else if(fee<0){
			result = fee.toFixed(2)
		}else{
			result = fee.toFixed(2)
		}
        return result;
    };
}])
// 交易记录 时间过滤
.filter("recordTimeFilter", [function () {
    return function(time){
		return time.replace(/T/, "/")
    };
}])
// 数量过万
.filter("overTenThousandFilter", [function () {
    return function (num){
		var result
		if(num<=10000){
			result = num
		}else{
			result = parseInt(num / 10000)+'w+'
		}
        return result;
    };
}])
// 秒转 时:分:秒
.filter("seconds_to_hhmmss", function() {
	function padding(value){
		if(value>9){
			return value
		}else{
			return '0' + value
		}
	}
    return function(seconds) {
        if (seconds && (seconds>=0)) {
            var seconds = Number(seconds);
            var hh = (seconds / 3600) >= 1 ? Math.floor(seconds / 3600) : 0;
            var mm = ((seconds - hh * 3600) / 60) >= 1 ? Math.floor((seconds - hh * 3600) / 60) : 0;
            var ss = seconds - hh * 3600 - mm * 60;
            
            return padding(hh)+ ':' + padding(mm) + ':' + padding(ss);
        } else {
            return '00:00:00';
        }
    }
})
// 搜索高亮显示
.filter("highlight", function($sce, $log){

    var fn = function(text, search){
        $log.info("text: " + text);
        $log.info("search: " + search);

        if (!search) {
            return $sce.trustAsHtml(text);
        }
        text = encodeURI(text);
        search = encodeURI(search);

        var regex = new RegExp(search, 'gi')
        var result = text.replace(regex, '<span class="highlightedText">$&</span>');
        result = decodeURI(result);
        $log.info("result: " + result );
        return $sce.trustAsHtml(result);
    };

    return fn;
});
