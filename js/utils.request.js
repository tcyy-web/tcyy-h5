;
(function(w){
  w.request = {
    /*判断是否有网络*/
    getNetworkState:function(){
      	if(plus.networkinfo.getCurrentType()==plus.networkinfo.CONNECTION_NONE){
      		return false;
      	}else{
      		return true;
      	}
    },
    ajax:function( url,obj, successCallback, errorCallback ){
      if (!this.getNetworkState()) {
        mui.toast("当前网络不给力，请稍后再试");
        return;
      }
      var defaults = {
        statusFlag: true,// 默认处理错误类型
        showMsg: true,//默认显示系统消息
        showLoading: true,// 默认显示全局loading
        data: {}// 请求参数
      }
      mui.extend(true,defaults,obj);
      if (w.config) {
        url = w.config.url + url;
      }
      var waiting = null;
      if (defaults.showLoading === true) {
        waiting = plus.nativeUI.showWaiting();
      }
      var ajaxOptions = {
        dataType: 'json',//服务器返回json格式数据
        type: 'post',//HTTP请求类型
        timeout: 10000,//超时时间设置为10秒；
        headers: {'Content-Type': 'application/json'},
        data: defaults.data,
        success:function(data){
          console.log('服务器响应=============================');
          console.log('请求地址：'+ url);
          console.log('请求参数：'+ JSON.stringify(defaults.data));
          console.log('header：'+JSON.stringify(data.header));
          console.log('body：'+JSON.stringify(data.body));
          // loading处理
          if (waiting && defaults.showLoading === true) {
            waiting.close();
          }
          if (defaults.statusFlag === true) {
            if (data) {
              if (data.header && data.header.status) {
                switch (data.header.status){
                  case 2001:
                    if (data.header.msg && defaults.showMsg === true) {
                      mui.toast(data.header.msg);
                    }
                    break;
                  case 5001:
                    mui.toast(data.header.msg || '获取数据失败');
                    break;
                  case 6001:
                    mui.toast('登录状态失效，请重新登录');
                    w.authManage.toLogin();
                    break;
                  case 7001:
                    mui.toast('您没有权限');
                    break;
                  default:
                    break;
                }
              }
            }
            if (typeof successCallback === 'function') {
              var _success = false;
              if (data && data.header && data.header.status === 2001){
                _success = true;
              }
              successCallback(data.body, _success);
            }
          } else {
            if (typeof successCallback === 'function') {
              successCallback(data);
            }
          }
        },
        error:function(xhr,type,errorThrown){
          console.log('服务器请求错误=============================');
          console.log('请求地址：'+ url);
          console.log('请求参数：'+ JSON.stringify(defaults.data));
          console.log('错误类型：' + type);
          console.log('异常信息：' + errorThrown);
          console.log('异常内容：' + JSON.stringify(xhr));
          if (xhr.response) {
              console.log('服务器异常内容：' + xhr.response);
          }
          // loading处理
          if (waiting && defaults.showLoading === true) {
            waiting.close();
          }
          mui.toast("服务器连接出错，请稍后再试");
          if (typeof errorCallback === 'function') {
            errorCallback();
          }
        }
      }
      console.log('服务器请求=============================');
      console.log('请求地址：'+ url);
      console.log('请求类型：'+ ajaxOptions.type);
      console.log('请求参数：'+ JSON.stringify(defaults.data));
      mui.ajax(url, ajaxOptions);
    },
    loginAjax: function(url, obj, successCallback, errorCallback) {
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
      this.ajax(url, defaults, successCallback, errorCallback);
    }
  }
})(window);
