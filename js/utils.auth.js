;
(function(w){
  var userKey = '$user';
	w.authManage = {
    /*存储登录信息*/
    saveUser:function(userinfo) {
      userinfo = userinfo || {};
      if (w.storage) {
        w.storage.save({
          key: userKey,
          value: JSON.stringify(userinfo)
        });
      }
    },
    /*获取用户信息*/
    getUser:function() {
      if (w.storage) {
        var userinfo = w.storage.get({
          key:userKey
        }) || '{}';
        return JSON.parse(userinfo);
      }
      return {};
    },
    clearUser:function() {
      if (w.storage) {
        w.storage.del({
          key: userKey
        });
      }
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
    }
	}
})(window);
