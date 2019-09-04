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
// 跳转搜索页
function SearchPage () {
  mui.openWindow({
    id:'KZ_KT_SearchList',
    url: '/html/kz_kt/search.html',
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
// 跳转详情页
function DetailPage (extras) {
  mui.openWindow({
    id:'KZ_KT_Detail',
    url: '/html/kz_kt/details.html',
    show: {
      aniShow: 'pop-in'
    },
    styles: {
      popGesture: 'hide'
    },
    waiting: {
      autoShow: false
    },
    extras: extras
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
        resolve(data.data || []);
      }
    });
  })
}
// 我发布的课程列表
function CourseList (postData) {
  return new Promise(function(resolve) {
    request.loginAjax('courses/getCoursesList', {
      showMsg: false,
      data: postData
    }, function(data,success) {
      if (success) {
        resolve(data || []);
      }
    });
  })
}

// 查看课程详情
function CourseDetail (postData) {
  return new Promise(function(resolve) {
    request.loginAjax('courses/coursesDetails', {
      showMsg: false,
      data: postData
    }, function(data,success) {
      if (success) {
        resolve(data || []);
      }
    });
  })
}
// 处理列表结果
function trimSearchResult(list){
  _.forEach(list || [], function(o){
    o.priceText = o.price > 0 ? o.price : '免费';
    o.nicknameText = '';
    if (!!o.nickname) {
      JSON.parse(o.nickname);
    }
  });
  return list;
}
