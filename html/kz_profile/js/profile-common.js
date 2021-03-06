/* 区域*/
function ProfileArea () {
  return new Promise(function(resolve) {
    var KEY = 'profile-area';
    var cacheStr = storage.get({
      key: KEY
    }) || '{}';
    var cacheData = JSON.parse(cacheStr);
    if (cacheData.times) {
      var currentTime = new Date().getTime();
      var timeDiff = currentTime - cacheData.times;
      var day = timeDiff / 1000 / 60 / 60 / 24;
      // 1天获取一次
      if (day < 1) {
        resolve(cacheData.areas);
        return;
      }
    }
    request.loginAjax('area/getAreaList', {
      showMsg: false,
      data: {
        pid: 0
      }
    }, function(data,success) {
      if (success && data && data.length > 0) {
        mui.each(data, function(index, item){
          item.value = item.id;
          item.text = item.name;
        });       
        var trimData = utils.arrayToTree({
          arrays: data,
          pid: 'upid'
        });
        var d = new Date().getTime();
        storage.save({
          key: KEY,
          value: JSON.stringify({
            times: d,
            areas: trimData
          })
        });
        resolve(trimData);
      }
    });
  })
}
// 公司信息
function ProfileCompany () {
  return new Promise(function(resolve, reject) {   
    request.loginAjax('personalcompany/checkCompanyExists  ', {
      statusFlag: false
    }, function(data) {
      if (data && data.header && data.header.status == 2001) {       
        resolve(data.body);
      } else {
        reject();
      }
    });
  })
}
// 验证有无简历 onlyCheckHas= true  只验证有无简历信息
function ProfileResumeCheck (onlyCheckHas) {
  return new Promise(function(resolve, reject) {   
    request.loginAjax('personalresume/deliverResumerCheckBefore', {
      showMsg: false
    }, function(data,success, header) {
      if (onlyCheckHas == true) {
        if (data > 1) {
          resolve()
        } else {
          reject()
        }
      } else {
        // 审核通过
        if (data == 3) {
          resolve()
        } else if (data == 2) { // 待审核 或  未审核通过
          mui.toast(header.msg);
        } else {
          reject()
        }
      }
    });
  })
}
// 获取用户地址信息
function ProfileUserAddress () {
  var that = this;
  that.key = 'profile-address';
  that.getFromServer = function () {
    return new Promise(function(resolve, reject) {   
      request.loginAjax('personalresume/queryCompanyAndResumeInfo', {
        showMsg: false
      }, function(data, success) {
        if (success) {
          resolve(data[0]);
          storage.save({
            key: that.key,
            value: JSON.stringify(data[0])
          });
        }
      }, function(){
        reject()
      });
    });
  }
  that.getFromCache = function () {
    return new Promise(function(resolve, reject) {   
      var cacheStr = storage.get({
        key: that.key
      }) || '{}';
      var cacheData = JSON.parse(cacheStr);
      resolve(cacheData || {});
    });
  }
}


