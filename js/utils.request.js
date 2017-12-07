;
(function(w){
  var urlBegin = 'http://m.tianchiyueya.com:1888/tcyy/'
  w.request = {
    /*判断是否有网络*/
    getNetworkState:function(){
      	if(plus.networkinfo.getCurrentType()==plus.networkinfo.CONNECTION_NONE){
      		return false;
      	}else{
      		return true;
      	}
    },
    ajax:function( url,obj, successCallback ){
      if (!this.getNetworkState()) {
        mui.toast("当前网络不给力，请稍后再试");
        return;
      }
      var _url = urlBegin + url;
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
      console.log('请求地址:', _url, '请求类型:', defaults.type);
      console.log('请求参数:', JSON.stringify(defaults.data));
      mui.ajax(_url, defaults);
    },
    loginAjax: function(url, obj, successCallback) {
      var code = '';
      if (w.authManage) {
        var user = w.authManage.getUser();
        code = user.code || '';
      }
      var defaults = {
        data: {
          code: code,
        }
      }
      mui.extend(true, defaults, obj);
      this.ajax(url, defaults, successCallback);
    }
  }
})(window);
