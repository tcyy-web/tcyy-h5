/*枚举*/
;
(function(w){
	w.enums = {
		sex: {
			1:'男' ,2: '女'
		},
		category: {
			1: 'iconfont icon-icon',
			2: 'iconfont icon-kouqiangbaojian',
			3: 'iconfont icon-kouqiangmeirong',
			4: 'iconfont icon-kouqiangneike',
			5: 'iconfont icon-kouqiangwaike',
			6: 'iconfont icon-kouqiangxiufu',
			7: 'iconfont icon-kouqiangzhengji',
			8: 'iconfont icon-kouqiangzhongzhi'
		},
		planStatus: {
		  1: '等待就诊',
		  2: '未就诊',
		  3: '已就诊'
		},
		// 职位状态
		profile_position_status: {
		  0: '待审核',
      1: '审核通过',
      2: '审核不通过'
		},
		// 课程类型
		kc_type: {
		  1: '单集',
		  2: '多集'
		}
//		getEnumLabel: function(type, key) {
//			var _this = this;
//			if (_this[type]) {
//				return _this[type][key] || '';
//			}
//			return '';
//		}
	}
})(window);
