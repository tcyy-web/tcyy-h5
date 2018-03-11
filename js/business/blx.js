;
(function(w){
  w.blxFn = {
    // 获取详情
    detailFn: function(caseid, callback) {
      request.loginAjax('cases/getDetails', {
        data: {
          id: caseid
        },
        showMsg: false
      }, function(data, success) {
        if (success) {
          callback(data);
        }
      });
    },
    // 点赞
    dzFn: function(caseid, callback) {
      request.loginAjax('cases/thing', {
        data: {
          case_id: caseid
        }
      }, function(data, success) {
        if (success) {
          callback();
        }
      });
    },
    // 关注
    gzFn: function(uid, callback) {
      request.loginAjax('cases/follow', {
        data: {
          touid: uid
        }
      }, function(data, success) {
        if (success) {
          callback(data);
        }
      });
    },
    // 删除病例秀
    delFn: function(caseid, callback) {
      mui.confirm('确定删除？', '删除病例秀', null, function(obj){
        if (obj.index === 1){
          request.loginAjax('cases/delDraft', {
            data: {
              case_id: caseid
            }
          }, function(data, success) {
            if (success) {
              callback();
            }
          });
        }
      }, 'div');
    },
    // 列表获取点赞的人
    dzUsersFn: function(caseid, callback) {
      request.loginAjax('cases/getThingList', {
        data: {
          case_id: caseid,
          page: 1,
          limit: 5
        },
        showMsg: false
      }, function(data, success) {
        if (success && data && data.data.length > 0) {
          callback(data.data);
        }
      });
    },
    // 删除评论
    delPlFn: function(plid, callback) {
      request.loginAjax('cases/delComment', {
        data: {
          id: plid
        }
      }, function(data, success) {
        if (success) {
          callback(data);
        }
      });
    }
  }
})(window);
