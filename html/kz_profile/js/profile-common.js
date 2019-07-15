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
      showMsg: false
    }, function(data,success) {
      if (success) {       
        resolve(data);
      } else {
        reject();
      }
    });
  })
}
// 验证有无简历
function ProfileResumeCheck () {
  return new Promise(function(resolve, reject) {   
    request.loginAjax('personalresume/deliverResumerCheckBefore', {
      showMsg: false
    }, function(data,success) {
      if (success) {       
        resolve();
      } else {
        reject();
      }
    });
  })
}
