/* 区域*/
function ProfileArea () {
  return new Promise(function(resolve) {
    request.loginAjax('area/getAreaList', {
      showMsg: false,
      data: {
        pid: 0
      }
    }, function(data,success) {
      if (success && data && data.length > 0) {
        
      }
    });
  })
}

