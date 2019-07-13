;
(function(w){
  var UNITS = {
    '年': 31557600000,
    '月': 2629800000,
    '天': 86400000,
    '小时': 3600000,
    '分钟': 60000,
    '秒': 1000
  };
  // 时间转化
  var humanize = function(milliseconds) {
    var humanize = '';
    mui.each(UNITS, function(unit, value) {
      if(milliseconds >= value) {
        humanize = Math.floor(milliseconds / value) + unit + '前';
        return false;
      }
      return true;
    });
    return humanize || '刚刚';
  }
	w.utils = {
    /*dom附加数据*/
    setDomData:function(domId,data) {
      var dom = document.getElementById(domId);
      if (dom != null) {
        dom.data_data = JSON.stringify(data);
      }
    },
    getDomData: function(domId) {
      var dom = document.getElementById(domId);
      if (dom != null && dom.data_data != null) {
         return JSON.parse(dom.data_data);
      }
      return null
    },
    // 日期格式化显示 dateStr：时间 nowStr:服务器当前时间
    formatDateToNow: function(dateStr, nowStr) {
      var cdate = this.parseDate(dateStr);
      var nowdate = this.parseDate(nowStr);
      var diff = nowdate.getTime() - cdate.getTime();
      // 小于天则格式化
      if(diff < UNITS['天']) {
        return humanize(diff);
      }
      // 大于则直接显示时间
      return dateStr.split(' ')[0];
    },
    //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
    parseDate: function(str) { 
      var a = str.split(/[^0-9]/);
      return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
    },
    insertAfter: function(newElement, targetElement){
      var parent = targetElement.parentNode;
      if (parent.lastChild == targetElement) {
        // 如果最后的节点是目标元素，则直接添加。因为默认是最后
        parent.appendChild(newElement);
      } else {
        //如果不是，则插入在目标元素的下一个兄弟节点 的前面。也就是目标元素的后面
        parent.insertBefore(newElement, targetElement.nextSibling);
      }
    },
    // 转换格式
    arrayToTree (opts) {
      var defaults = {
        arrays: [],
        id: 'id',
        pid: 'pid',
        children: 'children'
      }
      mui.extend(true,defaults,opts);
      let data = defaults.arrays;
      var id = defaults.id;
      var pid = defaults.pid;
      var children = defaults.children;
      let result = [];
      let hash = {};
      mui.each(data, function(index, item){
        hash[data[index][id]] = data[index];
      });
      mui.each(data, function(index, item){
        let hashVP = hash[item[pid]];
        if (hashVP) {
          !hashVP[children] && (hashVP[children] = []);
          hashVP[children].push(item);
        } else {
          result.push(item);
        }
      });
      return result;
    }
	}
	
	function _Enums () {
	  var KEY = 'base-dict';
	  var _that = this;
	  _that.allEnums = [];
	  _that.getEnums = function(key) {
	     return _.filter(_that.allEnums, function(o){
	       return o.dict_code == key;
	     })
	  }
	  _that.getEnumText = function(key, value) {
	    var exist = _.find(_that.allEnums, function(o){
	      return o.dict_code == key && o.dict_value == value
	    })
	    if (exist) {
	      return exist.dict_name
	    }
	    return '-'
	  }
	  _that.getAll = function (callback) {	    
      var cacheStr = storage.get({
        key: KEY
      }) || '{}';    
      console.log(cacheStr);
      var cacheData = JSON.parse(cacheStr);
      if (cacheData.times) {
        var currentTime = new Date().getTime();
        var timeDiff = currentTime - cacheData.times;
        var day = timeDiff / 1000 / 60 / 60 / 24;
        // 1天获取一次
        if (day < 1) {
          _that.allEnums = cacheData.dicts;
          callback(cacheData.dicts);         
          return;
        }
      }
      request.ajax('basedict/lists', {
        showMsg: false
      }, function(data,success) {
        if (success && data && data.length > 0) {                       
          var d = new Date().getTime();
          storage.save({
            key: KEY,
            value: JSON.stringify({
              times: d,
              dicts: data
            })
          });
          _that.allEnums = data;
          callback(data);         
        }
      });
	  }
	}
	w.Enums = new _Enums();
})(window);
