var deepMapping = function (jsonData) {
  function hasArr(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] instanceof Array) {
          return true;
        }
      }
    }
    return false;
  }
  function mapping(obj) {
    if (obj instanceof Array) {
      for (var i = 0; i < obj.length; i++) {
        if (hasArr(obj[i])) {
          obj[i] = mapping(obj[i]);
        }
        else {
          obj[i] = ko.mapping.fromJS(obj[i]);
        }
      }
      return ko.observableArray(obj);
    }
    else if (typeof obj == "object") {
      return ko.mapping.fromJS(obj);
    }
    return ko.observable(obj);
  }
  return mapping(jsonData);
};