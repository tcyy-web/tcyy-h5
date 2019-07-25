function PublishPage () {
  mui.openWindow({
    id:'kz_kt_publish',
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
