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
      return dateStr;
    },
    //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
    parseDate: function(str) { 
      var a = str.split(/[^0-9]/);
      return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
    }
	}
})(window);
