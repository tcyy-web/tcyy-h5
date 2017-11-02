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
  	this.conncheck(function(){
  		$.ajax( obj );
  	})
  }
}
})(window);
