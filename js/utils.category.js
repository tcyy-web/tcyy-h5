;
(function(w){
  var KEY = '$category'; 
	w.categorys = {
	  /*从缓存获取*/
		get: function() {
		  if (w.storage) {
		    var value = w.storage.get({
		      key: KEY
		    }) || '{}';
		    var parseValue = JSON.parse(value);
		    return parseValue.values || [];
		  }
		  return [];
		},
		/*从服务器获取*/
		getServer: function() {
		  if (w.request && w.storage) {
        var value = w.storage.get({
          key: KEY
        }) || '{}';
        var parseValue = JSON.parse(value);
		    if (parseValue.times) {
		      var currentTime = new Date().getTime();
		      var timeDiff = currentTime - parseValue.times;
		      var day = timeDiff / 1000 / 60 / 60 / 24;
		      // 7天获取一次
		      if (day < 1) {
		        return;
		      }
		    }
		    w.request.ajax('group/getList', {
		      showMsg: false
		    }, function(data,success) {
		    	
		      if (success && data && data.length > 0) {
		        var d = new Date().getTime();
            w.storage.save({
              key: KEY,
              value: JSON.stringify({
                times: d,
                values: data,
              })
            });
		      }
		    });
		  }
		},
	}
})(window);
