// 首先封装几个简易的函数
// 
//封装$函数
var $ = window.$ = function (selector) {
	return document.querySelector(selector);
}
//拿到输入框中的值
var getParamId = function () {
	var search = window.location.search; //?id=1
	var param = parseInt(search.split('=')[1]); //对输入的字符串过滤
	param = isNaN(param) ? 1 : param; //输入字符串默认转第一页
	return param;
}
/*
url不存在 或 请求出错页面
 */
var errorPage = function () {
	var div = document.createElement("div");
	div.innerHTML = "页面不存在";
	div.id = "error";
	div.style.cssText = "font-size:20px;color:#FF2F44;margin-top:200px;margin-left:150px;";
	$("#loading").appendChild(div);
}

/**封装ajax请求，创建ajax核心对象*/
function getXhr() {
	var xhr = null;
	if (window.XMLHttpRequest) { //除IE外的浏览器
		xhr = new XMLHttpRequest();
	} else {
		xhr = new ActiveXObject('Microsoft.XMLHttp'); //IE浏览器
	}
	return xhr;
}

// 请求数据
var pushAjax = function () {
	var xhr = getXhr();
	var id = getParamId();
	id = id > 10 ? 10 : id;
	id = id < 0 ? 1 : id;
	var url = "https://easy-mock.com/mock/5a3a2246ccd95b5cf43c272a/weimob/data/" + id + ".json";
	xhr.open("get", url, true);
	xhr.send(null);
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var data = xhr.responseText;
				// data = eval("("+data+")");        //json字符串转换成为json对象
				data = JSON.parse(data);
				if (data.errorcode == 0 || data.errorcode == '0') { //成功
					init(data); //初始化数据，向页面传值
				} else {
					errorPage();
				}
			} else {
				$("#loading").style.display = 'block';
				errorPage();
			}
		}
	}
}

// 开启预加载
document.onreadystatechange = function () {
	if (document.readyState == "complete") {
		$("#loading").style.display = 'none';
	}
}

pushAjax(); //页面开始就发送ajax请求
var init = function (data) {
	topData(data); //头部的信息
	goods(data); //商品信息
	if (data.status == 1) { //拼团成功
		$(".time-icon").innerHTML = "拼团成功,用时20时33分20秒";
	} else if (data.status == -1) { //失败
		$(".time-icon").innerHTML = "本团拼团失败";
		$(".time-icon").style.cssText = "background-color:#959595;border-radius:20px;";
	} else { //拼团进行中
		$('.time-icon strong').innerHTML = data.info.missCount;
		timeDown(data.info.countDown); //开启倒计时
	}
	addCustom(data.info); //添加参团人的信息
	addStore(data.info.stores); //商店信息
	updateStatus(data.info.step); //修改活动说明中的状态
	addBtn(data.info); //底部按钮上的状态信息
}

/**
 * 
 * @param data.info.step
 * 	updateStatus
 * 修改活动说明中的状态 
 */

var updateStatus = function (step) {
	if (step == 3) {
		$(".step-two img").src = "images/friend.png";
		$(".step-three img").src = "images/active-friend.png";
		$(".step-two span").style.color = "#1a1a1a";
		$(".step-three span").style.color = "#ff2e45";
		$(".step-two span").className ="sort-two";
		$(".step-three span").className = "sort-three-active";
	}else if(step == 0 ){
		$(".step-two span").style.color = "#1a1a1a";
		$(".step-two span").className ="sort-two";
		$(".step-two img").src = "images/friend.png";
	}
}
var addCustom = function (data) {
	addHost(data.host); //添加发起人的信息	
	addGuest(data.guests, data.missCount); //添加加入人的信息
}

var addHost = function (data) {
	$(".host-info-right>img").src = data.avatar;
	$("#_username").innerHTML = data.hostName;
	$("#_push-time").innerHTML = data.pushTime;
}

var addGuest = function (data, missCount) {
	data.forEach(function (value, index) {
		var div = document.createElement("div");
		var str = "";
		if (index % 2 == 0) { //偶数放右边
			if (index == 0) { //右边第一个
				str += "<div class='right-guest fr right-guest-first'><div class='guest-line'><span class='out-circle'><span class='inner-circle'></span></span>";
				str += "</div><div class='guest-info clear'><div class='host-info-right fl right-guest-right'><img src='" + value.avatar + "' alt='" + value.guestName + "' height='40' width='40'>";
				str += "</div><div class='host-info-left fl right-guest-info'><div class='username'>" + value.guestName + "</div><div class='push-time'>" + value.joinTime + "</div></div><div class='triangle'></div></div></div>";
			} else {
				str = "<div class='right-guest fr'><div class='guest-line'><span class='out-circle'><span class='inner-circle'></span></span>";
				str += "</div><div class='guest-info clear'><div class='host-info-right fl right-guest-right'><img src='" + value.avatar + "' alt='" + value.guestName + "' height='40' width='40'>";
				str += "</div><div class='host-info-left fl right-guest-info'><div class='username'>" + value.guestName + "</div><div class='push-time'>" + value.joinTime + "</div></div><div class='triangle'></div></div></div>";
			}
		} else {
			//奇数放左边
			str += "<div class='left-guest fl'><div class='left-line'><span class='out-circle'><span class='inner-circle'></span></span></div>";
			str += "<div class='guest-info clear guest-info-left'><div class='host-info-right fr left-guest-left'><img src='" + value.avatar + "' alt='" + value.guestName + "' height='40' width='40'></div>";
			str += "<div class='host-info-left fr left-guest-info'><div class='username'>" + value.guestName + "</div><div class='push-time'>" + value.joinTime + "</div></div><div class='triangle'></div></div></div>";
		}
		div.innerHTML = str;
		$(".sell-people").appendChild(div);
	})
	if (data.length % 2 == 0 && missCount != 0) {
		var nextDiv = document.createElement("div");
		var str1 = "<div class='right-guest fr default-right-guest'><div class='guest-line default-guest-line'><span class='out-circle'><span class='inner-circle'></span></span></div>";
		str1 += "<div class='dash-line'><span></span><span></span><span></span><span></span><span></span><span></span></div><div class='guest-info clear default-info'><div class='host-info-right fl right-guest-right default-guest-right'><img src='images/goods.png' alt='头像' height='40' width='40'>";
		str1 += "</div><div class='host-info-left fl right-guest-info default-guest-info'><div class='username'>还差<strong>" + missCount + "</strong>人,赶快召唤你的伙伴来拼团~</div></div><div class='triangle'></div></div></div>";
		nextDiv.innerHTML = str1;
		$(".sell-people").appendChild(nextDiv);
	}
}
//修改头部模块的数据
var topData = function (data) {
	$(".sell-status").innerHTML = data.info.title; //头部的标题
	$(".sell-tit img").src = data.info.titleImage;
	$(".sell-condition").innerHTML = addCondition(data.info.missCount, data.number); //还差几个小伙伴参团
}

var addBtn = function (data) {
	$(".invite").innerHTML = data.btnName;
}
//添加商店信息
var addStore = function (data) {
	$(".store-info-left img").src = data.storeLogo;
	$(".store-name").innerHTML = data.storeName;
}
//还差几个小伙伴参团 ,numbere为剩余的人员 ,index 为 第几个页面
var addCondition = function (number, index) {
	var nodeStr = "";
	switch (index) {
		case 1:
			nodeStr = "还差<strong>" + number + "</strong>枚小伙伴就可以成功团购啦,快邀请好友参团吧!";
			break;
		case 2:
			nodeStr = "团长,还差<strong>" + number + "</strong>枚小伙伴就可拼团成,快邀请好友参团吧!";
			break;
		case 3:
			nodeStr = "团长,还差<strong>" + number + "</strong>枚小伙伴就可拼团成,快邀请好友参团吧!";
			break;
		case 4:
			nodeStr = "还需要<strong>" + number + "</strong>枚小伙伴参与,快邀请好友参团吧!";
			break;
		case 5:
			nodeStr = "还差<strong>" + number + "</strong>枚小伙伴就可以成功团购啦,快邀请好友参团吧!";
			break;
		case 6:
			nodeStr = "你已参团,还差<strong>" + number + "</strong>枚小伙伴就可拼团成,快邀请好友参团吧!";
			break;
		case 7:
			nodeStr = "卖家会尽快发货的哟~";
			break;
		case 8:
			nodeStr = "卖家会尽快发货的哟~";
			break;
		case 9:
			nodeStr = "未按时达到成团人数,系统会在1-2个工作日内原路退款至各成员的支付账户内哟~";
			break;
		case 10:
			nodeStr = "未按时达到成团人数,系统会在1-2个工作日内原路退款至各成员的支付账户内哟~";
			break;
	}
	return nodeStr;
}

//商品信息
var goods = function (data) {
	$(".goods-logo img").src = data.info.goods.goodsImage
	$(".goods-title").innerHTML = data.info.goods.goodsName.slice(0, 25) + "...";
	$(".goods-number i").innerHTML = data.info.goods.goodsNumber;
	$(".goods-price i").innerHTML = data.info.goods.goodsPrice.toFixed(2);
}

var timeDown = function () { //将时间戳转为标准事件格式
	var date = new Date();
	var oldDate = new Date("2017/12/27 12:00:00");
	var lastTime = oldDate.getTime() - date.getTime();
	var d = Math.floor(lastTime / 60 / 60 / 1000 / 24);
	var h = Math.floor(lastTime / 60 / 60 / 1000 % 24);
	var minute = Math.floor(lastTime / 60 / 1000 % 60);
	var second = Math.floor(lastTime / 1000 % 60);
	h < 10 ? h = '0' + h : h;
	minute < 10 ? minute = '0' + minute : minute;
	second < 10 ? second = '0' + second : second;
	if (h == 0 && minute == 0 && minute == 0) {
		$(".time-icon").innerHTML = "本团拼团失败";
		clearTimeout(time);
	}
	$(".hour").innerHTML = h;
	$(".minute").innerHTML = minute;
	$(".second").innerHTML = second;
	var time = setTimeout(timeDown, 1000);
}