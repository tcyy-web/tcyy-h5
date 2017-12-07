;
(function(w){
w.tools = {
  saveData:function( obj ){
	plus.storage.setItem( obj.key , obj.value);
  },
  getData:function( key ){
	return plus.storage.getItem( key );
  },
  deleteData:function( key ){
	plus.storage.removeItem(key);
  },
  /*存储登录信息*/
  saveUser:function(userinfo) {
  	userinfo = userinfo || {};
  	this.deleteData('$user');
	this.saveData({
		key: '$user',
		value: JSON.stringify(userinfo)
	});
  },
  /*获取用户信息*/
  getUser:function() {
	var userinfo = this.getData('$user') || "{}";
	return JSON.parse(userinfo);
  },
  clearUser:function() {
  	this.deleteData('$user');
  },
  /*判断是否登录*/
  checkLogin:function() {
  	var user = this.getUser();
  	if (user.id > 0) {
  		return true;
  	} else {
  		return false;
  	}
  },
  /*跳转登录*/
  toLogin:function(fromurl, fromid){
  	var extras = {};
	if (fromurl) {
		extras.fromurl = fromurl;
		extras.fromid = fromid;
	}
	mui.openWindow({
		url: '../login/login.html',
		id: 'login',
		preload: true,
		createNew: true,
		show: {
			aniShow: 'pop-in'
		},
		styles: {
			popGesture: 'hide'
		},
		waiting: {
			autoShow: false
		},
		extras: extras
	});
  },
  /*判断是否有网络*/
  getNetworkState:function(){
  	if(plus.networkinfo.getCurrentType()==plus.networkinfo.CONNECTION_NONE){
  		return false;
  	}else{
  		return true;
  	}
  },
  ajaxData:function( url,obj, successCallback ){
  	if (!this.getNetworkState()) {
  		mui.toast("当前网络不给力，请稍后再试");
  		return;
  	}
  	var _url = 'http://m.tianchiyueya.com:1888/tcyy/' + url;
  	var defaults = {
  		dataType: 'json',//服务器返回json格式数据
		type: 'post',//HTTP请求类型
		timeout: 10000,//超时时间设置为10秒；
		headers: {'Content-Type': 'application/json'},
		success:function(data){
			console.log('接口返回信息', JSON.stringify(data));
			if (data) {
				if (data.header && data.header.status) {
					switch (data.header.status){
						case 2001:
								if (typeof successCallback === 'function') {
									successCallback(data.body);
								}
							break;
						case 5001:
							mui.toast(data.header.msg || '获取数据失败')
							break;
						case 6001:
							mui.toast('登录状态失效，请重新登录')
							break;
						case 7001:
							mui.toast('您没有权限')
							break;
						default:
							break;
					}
				}
			}
			
		},
		error:function(xhr,type,errorThrown){
			//异常处理；
			mui.toast("服务器连接出错，请稍后再试");
			console.log('接口错误信息：',JSON.stringify(xhr),type,errorThrown);
		}
  	}
  	mui.extend(defaults, obj);
  	mui.ajax( _url,defaults );
  }
}
})(window);
