;
(function(w){
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
    }
	}
})(window);
