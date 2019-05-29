angular.module('App')
.factory('$Factory',function(){
    var baseSever = 'https://app.fang-tian.com';
    var mediaServer = 'http://ftm.fang-tian.com'
    // var baseSever = '/yuanChengDaiLi';
    // var mediaServer = '/mediaupload'
    // var baseSever = 'http://192.168.0.59';
    // var mediaServer = 'http://ftm.fang-tian.com'
    // var baseSever = '/yuanChengTest';
    // var mediaServer = '/mediaupload'
    // var baseSever = '';
    // var mediaServer = 'http://ftm.fang-tian.com'
	return{
        host:baseSever,
        AppJson:{
            version: { url: baseSever + '/api/Account/Version', method: 'GET' },
        },
        Account: {
            hjson: { url: baseSever + '/app/data.json', method: 'GET' },//前端数据
            upload: { url: baseSever + '/Upload/Save', method: 'POST' },//上传图片 {path,file,orientation,noWater}
            uploadmedia: { url: mediaServer + '/Upload/SaveMedia', method: 'POST' },//上传图片 {path,file,orientation,noWater}
            msg: { url: baseSever + '/api/Account/SendMsg', method: 'POST' }, //发送短信 {phone,isResist=[1 注册，null 验证]} 
            sendinvit: { url: baseSever + '/api/Account/SendInvit', method: 'POST' }, //发送邀请短信 {phone,isResist=[1 注册，null 验证]} 
            register: { url: baseSever + '/api/Account/Register', method: 'POST' },//注册 {Phone，Password，Msg}
            forgotpwd: { url: baseSever + '/api/Account/ForgotPassword', method: 'POST' },//修改密码 {Phone，Password，Msg}
            changepwd: { url: baseSever + '/api/Account/ChangePassword', method: 'POST' },//修改密码 {Phone，Password，Msg}
            login: { url: baseSever + '/Token', method: 'POST' },//登录
            logout: { url: baseSever + '/api/Account/LogOut', method: 'POST' },//登出
            qcode: { url: baseSever + '/api/Account/QrCode', method: 'GET' },
            getuserinfo: { url: baseSever + '/api/Account/UserInfo', method: 'GET' },
            setuserinfo: { url: baseSever + '/api/Account/SetUserInfo', method: 'POST' },
            showinfo: { url: baseSever + '/api/Account/ShowInfo', method: 'POST' },//个人主页
            gethier: { url: baseSever + '/api/Account/GetHier', method: 'GET' },
            wxlogin: { url: baseSever + '/api/Account/WeixinLogin', method: 'POST' },
            exterlogin: { url: baseSever + '/api/Account/ExterLogin', method: 'POST' },//第三方登录
            addexterlogin: { url: baseSever + '/api/Account/AddExternalLogin', method: 'POST' },//绑定第三方
            removelogin: { url: baseSever + '/api/Account/RemoveLogin', method: 'POST' },//解绑第三方
            getexterlogins: { url: baseSever + '/api/Account/GetExterLogins', method: 'POST' },//获取第三方
        },
        Logo:{
            latest: { url: baseSever + '/api/HouseSource/NewestQuery', method: 'GET' },//最新数据
        },
        News:{
            query: { url: baseSever + '/api/News/Query', method: 'POST' },
            get: { url: baseSever + '/api/News/Get', method: 'GET' },
            banner: { url: baseSever + '/api/News/Banners', method: 'POST'},
            approve: { url: baseSever + '/api/News/Approve', method: 'POST'},//文章点赞
        },
        Evalu:{
            search: { url: baseSever + '/api/Evalue/ZonePrice', method: 'POST' },
            list: { url: baseSever + '/api/Evalue/Query', method: 'POST' },
            get: { url: baseSever + '/api/Evalue/Get', method: 'GET'},
            save: { url: baseSever + '/api/Evalue/Save', method: 'POST'},
            delete: { url: baseSever + '/api/Evalue/Delete', method: 'POST'},
            reply: { url: baseSever + '/api/Evalue/RepSave', method: 'POST'},
            querylist: { url: baseSever + '/api/Evalue/UserQuery', method: 'POST'},
        },
        HouseProxy:{
            applicant: { url: baseSever + '/api/HouseProxy/Applicant', method: 'POST' },
            ownerget: { url: baseSever + '/api/HouseProxy/Get', method: 'GET' },
            verify: { url: baseSever + '/api/HouseProxy/Verify', method: 'POST'},
            applicantlist: { url: baseSever + '/api/HouseProxy/ApplicantList', method: 'POST'},
        },
        NewHouseSource:{
            communities: { url: baseSever + '/api/HouseSource/Communities', method: 'GET', isArray: true },//小区查询
            query: { url: baseSever + '/api/HouseSource/Query', method: 'GET'},//需登录
            publicquery: { url: baseSever + '/api/HouseSource/CustQuery', method: 'POST'},//不用登录
            save: { url: baseSever + '/api/HouseSource/Save', method: 'POST' },
            auth: { url: baseSever + '/api/HouseSource/Auth', method: 'POST' },
            authget: { url: baseSever + '/api/HouseSource/AuthGet', method: 'GET' },
            getcomment: { url: baseSever + '/api/HouseSource/Comment', method: 'GET' },
            savecomment: { url: baseSever + '/api/HouseSource/CommentSave', method: 'PSOT' },
            counts: { url: baseSever + '/api/HouseSource/Counts', method: 'GET' },
            detail: { url: baseSever + '/api/HouseSource', method: 'GET' },//详情需要登录
            postdetail: { url: baseSever + '/api/HouseSource', method: 'POST' },//详情不用登录
            delete: { url: baseSever + '/api/HouseSource/Delete', method: 'POST' },
        },
        SimpleHouse:{//二类房源
            selfquery: { url: baseSever + '/api/House/Query', method: 'POST' },
            publicquery: { url: baseSever + '/api/House/CustQuery', method: 'POST' },
            save: { url: baseSever + '/api/House/save', method: 'POST' },
            shopsave: { url: baseSever + '/api/House/ShopSave', method: 'POST' },
            delete: { url: baseSever + '/api/House/Delete', method: 'POST' },
            getdetail: { url: baseSever + '/api/House/GET', method: 'GET' },
            auth: { url: baseSever + '/api/House/Auth', method: 'POST' },
            authget: { url: baseSever + '/api/House/AuthGet', method: 'GET' },
        },
        MyHouse:{//我的房源
            myhouse: { url: baseSever + '/api/MyHouse/Query', method: 'POST' },
        },
        NewHouse:{
            query: { url: baseSever + '/api/NewHouse/Query', method: 'POST' },//新房查询
            publicquery: { url: baseSever + '/api/NewHouse/CustQuery', method: 'GET' },//新房查询
            cities: { url: baseSever + '/api/NewHouse/Cities', method: 'GET' },
            getdetail: { url: baseSever + '/api/NewHouse', method: 'GET' },
            postdetail: { url: baseSever + '/api/NewHouse/save', method: 'POST' },
        },
        NewHouseProxy:{
            applicant: { url: baseSever + '/api/newHouseProxy/Applicant', method: 'POST' },
            applicantlist: { url: baseSever + '/api/newHouseProxy/UserList', method: 'POST' },
            mylist: { url: baseSever + '/api/newHouseProxy/ApplicantList', method: 'POST' },
            proxy: { url: baseSever + '/api/Proxy', method: 'POST' },
        },
        HouseNeed:{
            publicquery: { url: baseSever + '/api/HouseNeed/CustQuery', method: 'GET' },
            query: { url: baseSever + '/api/HouseNeed/Query', method: 'GET' },
            detail: { url: baseSever + '/api/HouseNeed/Get', method: 'GET' },
            save: { url: baseSever + '/api/HouseNeed/Post', method: 'POST' },
            change: { url: baseSever + '/api/HouseNeed', method: 'PUT' },
            delete: { url: baseSever + '/api/HouseNeed/Delete', method: 'DELETE' },
        },
        ReChange:{
            query: { url: baseSever + '/api/Recharge/Query', method: 'GET' },
            surplus: { url: baseSever + '/api/Recharge/Surplus', method: 'POST' }, //vip剩余的金额
        },
        Community:{
            add: { url: baseSever + '/api/Community/Add', method: 'POST' },
            query: { url: baseSever + '/api/Community/Query', method: 'POST' },
            cities: { url: baseSever + '/api/Community/cities', method: 'POST' },
        },
        TextTemplate:{
            save: { url: baseSever + '/api/TextTemplate/Save', method: 'POST' },
            query: { url: baseSever + '/api/TextTemplate/Query', method: 'GET' },
            delete: { url: baseSever + '/api/TextTemplate/Delete', method: 'POST' },
        },
        VerifyMsgs:{
            save: { url: baseSever + '/api/Message/Save', method: 'POST' },
            query: { url: baseSever + '/api/Message/Query', method: 'POST' },
            delete: { url: baseSever + '/api/Message/Delete', method: 'POST' },
            phonecontacts: { url: baseSever + '/api/Message/UserMatch', method: 'POST' },
            linkmandetail: { url: baseSever + '/api/Message/SearchUser', method: 'POST' },
            updateuserinfo: { url: baseSever + '/api/Message/UpdateUserInfo', method: 'POST' },
        },
        WxPay:{
            unifiedorder: { url: baseSever + '/api/WxPay/Unifiedorder', method: 'POST' },
            notify: { url: baseSever + '/api/WxPay/Notify', method: 'POST' },
            query: { url: baseSever + '/api/WxPay/Query', method: 'POST' },
            close: { url: baseSever + '/api/WxPay/Close', method: 'POST' },
            wxpay: { url: baseSever + '/api/WxPay', method: 'GET' },
            userid: { url: baseSever + '/api/WxPay?userId={userId}&role={role}', method: 'POST' },
        },
        WxJs:{
            jsconfig: { url: baseSever + '/api/WxPay/JsConfig', method: 'POST' },
        },
        AliPay:{
            unifiedorder: { url: baseSever + '/api/Alipay/Unifiedorder', method: 'POST' },
            notify: { url: baseSever + '/api/Alipay/Notify', method: 'POST' },
            query: { url: baseSever + '/api/Alipay/Query', method: 'POST' },
            close: { url: baseSever + '/api/Alipay/Close', method: 'POST' },
        },
        Allin:{
            checkuser: { url: baseSever + '/api/Allin/CheckUser', method: 'POST' },//检测用户 无=》创建
            getinfo: { url: baseSever + '/api/Allin/GetInfo', method: 'GET' },//用户信息
            setname: { url: baseSever + '/api/Allin/SetName', method: 'POST' },//实名
            getcardbin: { url: baseSever + '/api/Allin/GetCardBin', method: 'GET' },//银行卡号信息
            applybindcard: { url: baseSever + '/api/Allin/ApplyBindCard', method: 'POST' },//请求绑定银行卡
            bindcard: { url: baseSever + '/api/Allin/BindCard', method: 'POST' },//确认绑定银行卡
            querycards: { url: baseSever + '/api/Allin/QueryCards', method: 'POST' },//查询绑定银行卡
            unbindcard: { url: baseSever + '/api/Allin/UnbindCard', method: 'POST' },//查询绑定银行卡
            setsafecard: { url: baseSever + '/api/Allin/SetSafeCard', method: 'POST' },//设置安全卡
            sendmsg: { url: baseSever + '/api/Allin/SendMsg', method: 'POST' },//发送验证码
            bindphone: { url: baseSever + '/api/Allin/BindPhone', method: 'POST' },//绑定手机
            changephone: { url: baseSever + '/api/Allin/ChangePhone', method: 'POST' },//绑定新手机
            applydeposit: { url: baseSever + '/api/Allin/ApplyDeposit', method: 'POST' },//充值
            applyconsume: { url: baseSever + '/api/Allin/ApplyConsume', method: 'POST' },//消费
            pos: { url: baseSever + '/api/Allin/POS', method: 'POST' },//POS支付
            applydraw: { url: baseSever + '/api/Allin/ApplyDraw', method: 'POST' },//提现
            pay: { url: baseSever + '/api/Allin/Pay', method: 'POST' },//调起支付
            mpay: { url: baseSever + '/api/Allin/MPay', method: 'POST' },//完成提现
            orderquery: { url: baseSever + '/api/Allin/OrderQuery', method: 'POST' },//查询订单
            transfer: { url: baseSever + '/api/Allin/Transfer', method: 'POST' },//转账
            querybalance: { url: baseSever + '/api/Allin/QueryBalance', method: 'POST' },//余额
            refund: { url: baseSever + '/api/Allin/ReFund', method: 'POST' },//退款
            contract:{ url: baseSever + '/api/Allin/Contract', method: 'POST'},//签约
            posquerybind:{ url: baseSever + '/api/Allin/POSQueryBind', method: 'POST'},//查询绑定POS

            notify: { url: baseSever + '/api/Allin/Notify', method: 'GET' },//订单通知
        },
        NewHouseTrade:{
            wantlook: { url: baseSever + '/api/NewHouseTrade/Look', method: 'POST' },
            visitreport: { url: baseSever + '/api/NewHouseTrade/Report', method: 'POST' },
            landagentlist: { url: baseSever + '/api/NewHouseTrade/ManageList', method: 'POST' },
            agentlist: { url: baseSever + '/api/NewHouseTrade/ProxysList', method: 'POST' },
            orderlist: { url: baseSever + '/api/NewHouseTrade/UsersList', method: 'POST' },
            cancelorder: { url: baseSever + '/api/NewHouseTrade/Cancel', method: 'POST' },//用户取消预约
            looking: { url: baseSever + '/api/NewHouseTrade/Looking', method: 'POST' },//经纪人带看操作
            looked: { url: baseSever + '/api/NewHouseTrade/Looked', method: 'POST' },//带看完成申请
            traded: { url: baseSever + '/api/NewHouseTrade/Traded', method: 'POST' },//交易完成申请
            verify: { url: baseSever + '/api/NewHouseTrade/Verify', method: 'POST' },//代理商审核
            getdetail: { url: baseSever + '/api/NewHouseTrade/Get', method: 'POST' },
            query: { url: baseSever + '/api/NewHouseTrade', method: 'POST' },
            close: { url: baseSever + '/api/NewHouseTrade', method: 'POST' },
        },
        Money:{
            money: { url: baseSever + '/api/Money/Money', method: 'POST' },//余额
            record: { url: baseSever + '/api/Money/Record', method: 'POST' },
            transfer: { url: baseSever + '/api/Money/Transfer', method: 'POST' },//转账红包
            income: { url: baseSever + '/api/Money/Income', method: 'POST' },//确认收账
            setpassword: { url: baseSever + '/api/Money/SetPassword', method: 'POST' },//修改密码
            ispassword: { url: baseSever + '/api/Money/IsPassword', method: 'POST' },//查询是否设置密码
            consumeuser: { url: baseSever + '/api/Money/ConsumeUser', method: 'POST' },//余额购买会员
            groupredpack: { url: baseSever + '/api/Money/GroupRedPack', method: 'POST' },//发群红包
            opengrouppack: { url: baseSever + '/api/Money/OpenGroupPack', method: 'POST' },//收群红包
           
        },
        WaitReceive:{
            bonuslist: { url: baseSever + '/api/Receive/List', method: 'POST' },//奖励金列表
            getbonus: { url: baseSever + '/api/Receive/Receive', method: 'POST' },//领取奖励金
            getuser: { url: baseSever + '/api/Receive/ReceiveUser', method: 'POST' },//领取累积人数
            getvip: { url: baseSever + '/api/Receive/ReceiveRole', method: 'POST' },//领取会员一年
            refound: { url: baseSever + '//api/Receive/Refound', method: 'POST' },//申请退款
        },
        Neteast:{
            user: { url: baseSever + '/api/Neteast/User', method: 'POST' },
            sendmsg: { url: baseSever + '/api/Neteast/SendMsg', method: 'POST' },
            queryphone: { url: baseSever + '/api/Neteast/Query', method: 'POST' },
            getftid: { url: baseSever + '/api/Neteast/GetFtUserId', method: 'POST' },
            usermatch: { url: baseSever + '/api/Neteast/UserMatch', method: 'POST' },//匹配通讯录
        },
        BaiduAPI:{
            idcard: { url: baseSever + '/api/BaiduApi/IdCard', method: 'POST' },//身份证
            housecard: { url: baseSever + '/api/BaiduApi/HouseCard', method: 'POST' },//房产证
        },
        //商城
        Shoper:{
            create: { url: baseSever + '/api/Shoper/Create', method: 'POST' },
            get: { url: baseSever + '/api/Shoper/Get', method: 'GET' },
            home: { url: baseSever + '/api/Shoper/Home', method: 'GET' },
        },
        Category:{
            query: { url: baseSever + '/api/Category/Query', method: 'GET' },
        },
        UserAddress:{
            query: { url: baseSever + '/api/Address/Query', method: 'POST' },
            get: { url: baseSever + '/api/Address/Get', method: 'GET' },
            save: { url: baseSever + '/api/Address/Save', method: 'POST' },
            delete: { url: baseSever + '/api/Address/delete', method: 'POST' },
        },
        ProductOrder:{
            carts: { url: baseSever + '/api/ProductOrder/Carts', method: 'GET' },
            create: { url: baseSever + '/api/ProductOrder/Create', method: 'POST' },
            orderquery: { url: baseSever + '/api/ProductOrder/OrderQuery', method: 'POST' },
            status: { url: baseSever + '/api/ProductOrder/status', method: 'POST' },
            tracequery: { url: baseSever + '/api/ProductOrder/TraceQuery', method: 'POST' },//物流
            isnewer: { url: baseSever + '/api/ProductOrder/IsNewer', method: 'POST' },//是否新人
            newerpacket: { url: baseSever + '/api/ProductOrder/NewerPacket', method: 'POST' },//领取新人礼包
        },
        Product:{
            query: { url: baseSever + '/api/Product/Query', method: 'POST' },
            get: { url: baseSever + '/api/Product/Get', method: 'GET' },
            commentadd: { url: baseSever + '/api/Product/CommentAdd', method: 'POST' },
            replycomment: { url: baseSever + '/api/Product/ReplyComment', method: 'POST' },
            comments: { url: baseSever + '/api/Product/Comments', method: 'POST' },
            agree: { url: baseSever + '/api/Product/Agree', method: 'POST' },
        },
        OderPay:{//商品支付
            wxpay: { url: baseSever + '/api/OrderPay/wxpay', method: 'POST' },
            wxnotify: { url: baseSever + '/api/OrderPay/wxNotify', method: 'POST' },
            alipay: { url: baseSever + '/api/OrderPay/alipay', method: 'POST' },
            query: { url: baseSever + '/api/OrderPay/Query', method: 'POST' },
            allapplyconsume: { url: baseSever + '/api/OrderPay/allApplyConsume', method: 'POST' },
            allpay: { url: baseSever + '/api/OrderPay/allPay', method: 'POST' },
            consumeproduct: { url: baseSever + '/api/OrderPay/ConsumeProduct', method: 'POST' },
        },
        Zone:{
            home: { url: baseSever + '/api/Zone/Home', method: 'POST' },
            delete: { url: baseSever + '/api/Zone/Delete', method: 'POST' },
            save: { url: baseSever + '/api/Zone/Save', method: 'POST' },
            add: { url: baseSever + '/api/Zone/Add', method: 'POST' },
            get: { url: baseSever + '/api/Zone/Get', method: 'GET' },
            comments: { url: baseSever + '/api/Zone/Comments', method: 'POST' },
            agree: { url: baseSever + '/api/Zone/Agree', method: 'POST' },
            agreeuser: { url: baseSever + '/api/Zone/AgreeUser', method: 'POST' },
            drawimage: { url: baseSever + '/api/Zone/DrawImage', method: 'GET' },
            indexlist: { url: baseSever + '/api/Zone/indexList', method: 'POST' },
            follow: { url: baseSever + '/api/Zone/Follow', method: 'POST' },
            unfollow: { url: baseSever + '/api/Zone/UnFollow', method: 'POST' },
            followlist: { url: baseSever + '/api/Zone/FollowList', method: 'POST' },
        },
        Draw:{
            raffle: { url: baseSever + '/api/Draw/Raffle', method: 'POST' },//抽奖
            lists: { url: baseSever + '/api/Draw/Lists', method: 'POST' },//奖品列表
            getprize: { url: baseSever + '/api/Draw/GetPrize', method: 'POST' },//领取奖品
            times: { url: baseSever + '/api/Draw/Times', method: 'POST' },//获取抽奖次数
            myprize: { url: baseSever + '/api/Draw/MyPrize', method: 'POST' },//我的奖品
            redpack: { url: baseSever + '/api/Draw/RedPack', method: 'POST' },//拆红包
            redtimes: { url: baseSever + '/api/Draw/RedTimes', method: 'POST' },//红包次数
            myreds: { url: baseSever + '/api/Draw/MyReds', method: 'POST' },//红包记录
        },
        Share:{
            save: { url: baseSever + '/api/Share/Save', method: 'POST' },   //分享记录保存
        },
	}
})

/** * 微信分享插件Service */
.factory('WechatService', ['$ionicLoading',function($ionicLoading){  
    function share(params) {
        if (typeof Wechat === "undefined") {
            $ionicLoading.show({template:'尚未安装微信',duration:1500})
            return false;
        }
        Wechat.isInstalled(function (installed) {
            if(installed){
            }else{
                $ionicLoading.show({template:'尚未安装微信',duration:1500})
                return false;
            }
        }, function (reason) {			
        });
	
        Wechat.share(params,function (suc) {
          
            },function (err) {
                $ionicLoading.show({
                    template: err,
                    duration: 1500
                })
            }
        );
	    return true;
    };
    return {
        share: share,
    }
}])
//微信分享链接转base64
.factory('wechatLinkBase', [function () {
	function changeBase(url,callback){
        var mycans = document.getElementById("wechat_link_canvas");
		var cxt = mycans.getContext("2d");
		var img = new Image();
        img.src = url;
		img.onload = function(){

            // cxt.drawImage(img,0,0,width1,height1);	
            cxt.drawImage(img,0,0,mycans.width,mycans.height);	
            var base = mycans.toDataURL("image/jpeg");
            callback(base)
			return;
        }
	}
	return {
        changeBase: changeBase
	}
}])
.factory('upImgBase', [function () {
	function changeBase(url,callback){
        // var mycans = document.getElementById("up_imgs");
        var mycans = document.createElement("canvas");
		// var cxt = mycans.getContext("2d");
        var img = new Image();
        img.src = url;
        img.onload = function(){
            if(img.width>1200){
                mycans.width=1200
                mycans.height=(img.height/img.width)*1200
            }else if(img.height>1200){
                mycans.height=1200
                mycans.width=(img.width/img.height)*1200
            }else{
                mycans.width=img.width;
                mycans.height=img.height;
            }
            
            var cxt = mycans.getContext("2d");
            cxt.drawImage(img,0,0,mycans.width,mycans.height);		
            var base = mycans.toDataURL("image/jpeg");
            callback(base)
            return;
        }
	}

	return {
        changeBase: changeBase
	}
}])
.factory('enterViewLoad', ['$ionicLoading','$timeout',function ($ionicLoading,$timeout) {
	function load(noautohide){
        $ionicLoading.show({
            animation: 'fade-in',
            showBackdrop: false,
            showDelay: 0,
            template: '<p style="margin:0;" class="item-myicon"><ion-spinner icon="spiral" class="spinner-stable"></ion-spinner> </p>'
        });
        if(!noautohide){
            $timeout(function(){
                $ionicLoading.hide()
            },10000)
        }
    }
    function customload(template,duration){
        $ionicLoading.show({
            template: template,
            duration:duration || 1500,
            showBackdrop: false,
        });

    }
    function loadcontacts(){
        $ionicLoading.show({
            animation: 'fade-in',
            showBackdrop: false,
            showDelay: 0,
            template: '<div style="margin:0;" class="item-myicon">'+
            '<ion-spinner icon="spiral" class="spinner-stable"></ion-spinner>'
            +'<div style="margin:0 0 0 5px;display:inline-block;height:34px;line-height:34px; vertical-align: top;">正在获取朋友信息</div>'
            +'</div>'
        });
        $timeout(function(){
            $ionicLoading.hide()
        },10000)
    }

	return {
        load: load,
        customload:customload,
        loadcontacts:loadcontacts
	}
}])
