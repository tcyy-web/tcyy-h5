;
(function(w){
	w.storage = {
		save: function(obj) {
		  var defaults = {
		    type: 'global',
		    key: '$common',
		    value: '通用存储'
		  }
		  mui.extend(defaults, obj);
		  if (defaults.type === 'global') {
		    plus.storage.setItem(defaults.key , defaults.value);
		  } else {
		    localStorage.setItem(defaults.key , defaults.value);
		  }
		},
		get: function(obj) {
      var defaults = {
        type: 'global',
        key: '$common',
      }
      mui.extend(defaults, obj);
      if (defaults.type === 'global') {
        return plus.storage.getItem(defaults.key);
      } else {
        return localStorage.getItem(defaults.key);
      }
		},
    del: function(obj) {
      var defaults = {
        type: 'global',
        key: '$common',
      }
      mui.extend(defaults, obj);
      if (defaults.type === 'global') {
        plus.storage.removeItem(defaults.key);
      } else {
        localStorage.removeItem(defaults.key);
      }
    },
	}
})(window);
