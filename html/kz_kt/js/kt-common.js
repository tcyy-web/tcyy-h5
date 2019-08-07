// 跳转发布页
function PublishPage () {
  mui.openWindow({
    id:'KZ_KT_publish',
    url: '/html/kz_kt/publish.html',
    show: {
      aniShow: 'pop-in'
    },
    styles: {
      popGesture: 'hide'
    },
    waiting: {
      autoShow: false
    }
  });
}
// 视频搜索
function VideoSearch (postData) {
  return new Promise(function(resolve) {
    request.loginAjax('courses/search', {
      showMsg: false,
      data: postData
    }, function(data,success) {
      if (success) {
        resolve(data || []);
      }
    });
  })
}