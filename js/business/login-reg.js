(function($, owner) {
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