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
        if(i.id == 'qq') {
          actionbuttons.push({
            title: i.description,
            share: i
          });
        } else if(i.id == 'weixin') {
          actionbuttons.push({
            title: '微信好友',
            share: i
          });
          actionbuttons.push({
            title: '微信朋友圈',
            share: i
          });
        }
      });
      callback();
    }, function(e){
      mui.totast( "获取分享服务列表失败："+e.message);
    });
  }
  var _shareMsg = function(_share, msg) {
    _share.send(msg, function(){
      mui.toast('分享成功');
    }, function(e){
      console.log('分享失败:'+e.message+'，失败码：'+e.code);
      mui.toast('分享失败');
    });
  }
  w.shareApi = {
  	showActionSheet:function(msg) {
  	  var _this = this;
  	  getShares(function() {
  	    var actionstyle = {
          title: "分享到",
          cancel: "取消",
          buttons: actionbuttons
        };
        plus.nativeUI.actionSheet(actionstyle, function(e) {
          if (e.index > 0) {
            if (e.index == 2) { // 微信好友
              msg.extra = { scene: 'WXSceneSession' };
            } else if(e.index == 3) { // 微信朋友圈
              msg.extra = { scene: 'WXSceneTimeline' };
            }
            _this.shareMsg(actionbuttons[e.index - 1].share, msg);
          }
        });
  	  });
	  },
	  shareMsg: function(_share, msg) {
	    console.log('分享接口:'+JSON.stringify(_share));
	    console.log('分享内容:'+JSON.stringify(msg));
	    if (_share.authenticated) {
	      _shareMsg(_share, msg);
	    } else {
	      // 未授权则授权
	      _share.authorize(function(){
          _shareMsg(_share, msg);
        }, function(e){
          mui.toast('认证授权失败：'+e.code+' - '+e.message);
        });
	    }
	  }
	}
})(window);
