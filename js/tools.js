;
(function(w){
w.tools = {
  saveData:function( obj ){
		plus.storage.setItem( obj.key , obj.value);
  },
  getData:function( key ){
		plus.storage.getItem( key );
  },
  deleteData:function( key ){
		plus.storage.removeItem(key);
  },
  /*判断是否有网络*/
  getNetworkState:function(){
  	if(plus.networkinfo.getCurrentType()==plus.networkinfo.CONNECTION_NONE){
  		return false;
  	}else{
  		return true;
  	}
  },
  checkNetwork:function( fn ){
  	if( this.getNetState() ){
  		typeof fn === "funciton" && fn();
  	}else{
  		mui.toast("当前网络不给力，请稍后再试");
  	}
  },
  ajaxData:function( obj ){
  	var default = {
  		dataType: 'json',//服务器返回json格式数据
			type: 'get',//HTTP请求类型
			timeout: 10000,//超时时间设置为10秒；
			headers: {'Content-Type': 'application/json'},
			success:function(data){
			},
			error:function(xhr,type,errorThrown){
				//异常处理；
				console.log(type);
			}
  	}
  	mui.extend(default, obj);
  	this.conncheck(function(){
  		mui.ajax( obj );
  	})
  }
}
})(window);
