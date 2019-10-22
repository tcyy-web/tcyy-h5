;
(function(w){
  w.payApi = {
    // 获取支付参数
    getWxPayParams: function(payurl, callback) {
      var xhr=new XMLHttpRequest();
      xhr.onreadystatechange=function(){
        switch(xhr.readyState){
          case 4:
            if(xhr.status==200){
              callback(xhr.responseText);
            }else{
              plus.nativeUI.alert("获取支付参数失败");
            }
            break;
          default:
            break;
        }
      }
      xhr.open('get', payurl);
      xhr.send();
    }
  }
})(window);
