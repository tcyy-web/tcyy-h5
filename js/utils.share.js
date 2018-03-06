;
(function(w){
  var actionbuttons = [];
  var getShares = function(callback) {
    if (actionbuttons.length > 0) {
      callback();
      return;
    }
    plus.share.getServices( function(s){
      mui.each(s, function(index, i) {
        if(i.id == 'qq' || i.id == 'weixin') {
          actionbuttons.push({
            title: i.description,
            share: i
          });
        }
      });
      callback();
    }, function(e){
      mui.totast( "获取分享服务列表失败："+e.message);
    });
  }
  w.shareApi = {
    	showActionSheet:function(msg) {
    	  var _this = this;
    	  getShares(function() {
    	    var actionstyle = {
          title: "分享",
          cancel: "取消",
          buttons: actionbuttons
        };
        plus.nativeUI.actionSheet(actionstyle, function(e) {
          if (e.index > 0) {
            _this.shareMsg(actionbuttons[e.index - 1].share, msg);
          }
        });
    	  });
	  },
	  shareMsg: function(_share, msg) {
	    console.log('分享接口:'+JSON.stringify(_share));
	    console.log('分享内容:'+JSON.stringify(msg));
	    _share.send(msg, function(){
        mui.toast('分享成功');
      }, function(e){
        console.log('分享失败:'+e.message+'，失败码：'+e.code);
        mui.toast('分享失败');
      });
	  }
	}
})(window);
