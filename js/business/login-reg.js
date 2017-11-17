(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if (loginInfo.account.trim() === '') {
			return callback('请输入注册手机');
		}
		if (loginInfo.password.trim() === '') {
			return callback('请输入密码');
		}
		// TODO 调用登录接口
		var user = {
			username: 'mumu'
		};
		owner.setUserInfo(user);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.verify = regInfo.verify || '';
		if (regInfo.account.trim() === '') {
			return callback('请输入手机号');
		}
		if (regInfo.verify.trim() === '') {
			return callback('请输入验证码');
		}
    // TODO 调用服务器注册逻辑
		return callback();
	};

	/**
	 * 获取用户
	 **/
	owner.getUserInfo = function() {
		var stateText = localStorage.getItem('$user') || "{}";
		return JSON.parse(stateText);
	};
	/**
	 * 设置用户
	 **/
	owner.setUserInfo = function(state) {
		state = state || {};
		localStorage.setItem('$user', JSON.stringify(state));
	};
	/**
	 * 判断是否登录
	 */
	owner.checkLogin = function () {
		// TODO 检查逻辑
		return true;
	}
	/**
	 * 获取本地是否安装客户端
	 **/
	owner.isInstalled = function(id) {
		if (id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if (mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch (e) {}
		} else {
			switch (id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
}(mui, window.login = {}));