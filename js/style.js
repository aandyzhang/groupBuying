;(function () {
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
		var url = "https://easy-mock.com/mock/5a3a2246ccd95b5cf43c272a/weimob/data/" + id + ".json";
		xhr.open("get", url, true);
		xhr.send(null);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					var data = xhr.responseText;
					data = eval("(" + data + ")"); //json字符串转换成为json对象
					if (data.errorcode == 0 || data.errorcode == '0') { //成功
						init(data); //初始化数据，向页面传值
					} else {
						errorPage();
					}
				} else {
					errorPage();
				}
			}
		}
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
		$("#loading").style.display = 'block';
	}
	// 开启预加载
	document.onreadystatechange = function () {
		if (document.readyState == "complete") {
			$("#loading").style.display = 'none';
			console.log(1);
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
		addCustom(data.info);
		addStore(data.info.stores); //商店信息
		addBtn(data.info); //底部按钮上的状态信息
	}

	var addCustom = function (data) {
		var sell = document.getElementById("sell");
		//遍历数组,将参团人员添加上
		data.guests.forEach(function (value, index) {
			if (index % 2 == 0) { //偶数放左边
				var str = "";
				var div = document.createElement("div");
				div.className = "left";
				if (index == 0) {
					div.className = "active";
				}
				div.style.top = (index / 2) * 46 + 20 * (index / 2) + 20 + "px"; //计算高度
				var str = "<div class='left-host'><div class='host-logo fr'><div class='host-logo-wrap'><div class='img-wrap'>开团</div><img src='" + value.avatar + "' alt='头像' height='38' width='38'></div>";
				str += "</div><div class='host-descript fr'><h2>" + value.guestName + "</h2><div class='host-push-time'>" + value.joinTime + "</div></div><div class='right-triangle host-position'></div><div class='circle'>";
				str += "<span class='out-circle1'><span class='inner-circle1'></span></span></div></div>";
				div.innerHTML = str;
				sell.appendChild(div);
			} else { //奇数放在右边
				var str = "";
				var div = document.createElement("div");
				div.className = "right";
				div.style.top = (index / 2) * 46 + 20 * (index / 2) + 20 + "px";
				var str = "<div class='right-host'><div class='guest-logo fl'><div class='guest-logo-wrap'><img src='" + value.avatar + "' alt='头像' height='38' width='38'></div>";
				str += "</div><div class='guest-descript fl'><h2>" + value.guestName + "</h2><div class='guest-join-time'>" + value.joinTime + "</div></div><div class='left-triangle guest-position'></div><div class='right-circle'><span class='out-circle1'>";
				str += "<span class='inner-circle1'></span></span></div></div>";
				div.innerHTML = str;
				sell.appendChild(div);
			}

			//添加下边默认还差多少人的样式
			if (data.guests.length % 2 == 0 && index == data.guests.length - 1 && data.missCount != 0) { //如果是偶数则最后一项放在左边，奇数放右边
				var div = document.createElement("div");
				div.className = "default";
				var lastStr = "<div class='left-host'><div class='host-logo fr'><div class='host-logo-wrap'><img src='images/default.png'alt='头像' height='38' width='38'></div></div><div class='host-descript fr'>";
				lastStr += "<h2>还差<strong>6</strong>人，快邀请你的小伙伴</h2><div class='right-triangle host-position'></div> <div class='circle'><span class='out-circle1'><span class='inner-circle1'></span></span></div><div class='bottom-circle'>";
				lastStr += "<span></span><span></span><span></span><span></span><span></span></div></div></div>";
				div.innerHTML = lastStr;
				//距离上边的高度
				div.style.top = (data.guests.length / 2) * 46 + 20 * (data.guests.length / 2) + 20 + "px";
				$('.sell-people').appendChild(div);
				//当为人数为奇数时，将默认的放在右边
			} else if (data.guests.length % 2 != 0 && index == data.guests.length - 1 && data.missCount != 0) {
				var div = document.createElement("div");
				div.className = "default-r right";
				var lastStr = "<div class='right-host'><div class='guest-logo fl'><div class='guest-logo-wrap'><img src='images/default.png' alt='头像' height='38' width='38'></div></div><div class='guest-descript fl'>";
				lastStr += "<h2>还差<strong>6</strong>人,赶快召唤你伙伴来拼团</h2></div><div class='left-triangle guest-position'></div><div class='right-circle'>";
				lastStr += "<span class='out-circle1'><span class='inner-circle1'></span></span></div><div class='bottom-circle'><span></span><span></span><span></span><span></span><span></span></div></div>'";
				div.innerHTML = lastStr;
				div.style.top = (data.guests.length / 2) * 46 + 20 * (data.guests.length / 2) + 20 + "px";
				$('.sell-people').appendChild(div);
			}
		})
		//拼团成功时，去掉默认还有多少人的样式，并重新计算容器的高度
		if (data.missCount == 0) {
			sell.style.height = (data.guests.length / 2) * 46 + 20 * (data.guests.length / 2) + 20 + 15 + "px";
		} else {
			sell.style.height = (data.guests.length / 2) * 46 + 20 * (data.guests.length / 2) + 20 + 70 + "px";
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
		var h = Math.floor(lastTime / 60 / 60 / 1000);
		var minute = Math.floor(lastTime / 60 / 1000 % 60);
		var second = Math.floor(lastTime / 1000 % 60);
		h < 10 ? h = '0' + h : h;
		minute < 10 ? minute = '0' + minute : minute;
		second < 10 ? second = '0' + second : second;
		if (d == 0 && h == 0 && minute == 0 && minute == 0) {
			$(".time-icon").innerHTML = "本团拼团失败";
			clearTimeout(time);
		}
		$(".hour").innerHTML = h;
		$(".minute").innerHTML = minute;
		$(".second").innerHTML = second;
		var time = setTimeout(timeDown, 1000);
	}
}());