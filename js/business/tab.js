
function gotoGT () {
  var startWebview = plus.webview.getLaunchWebview();
  mui.openWindow({
    id: startWebview.id,
  });
}
function gotoKZ () {
  mui.openWindow({
    url: './tab-webview-kuozhan.html',
    id: 'TAB_KUOZHAN',
    preload: true,
    show: {
      aniShow: 'pop-in'
    },
    waiting: {
      autoShow: false
    }
  });
}
function gotoWD () {
  mui.openWindow({
    url: './tab-webview-wode.html',
    id: 'TAB_WODE',
    preload: true,
    show: {
      aniShow: 'pop-in'
    },
    waiting: {
      autoShow: false
    }
  });
}
function goto3D () {
  mui.openWindow({
    url: '../3d/three_3d_index.html',
    id: 'THTREE_3d_index',
    preload: true,
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
