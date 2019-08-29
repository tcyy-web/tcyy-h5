var LinkView = function() {
  var vm = this;
 
    // 跳转品牌列表
  vm.listBrand = function (data) {
  
    mui.openWindow({
      id:'KZ_SHOP_BRAND_LIST',
      url: './list-brand.html',
      show: {
        aniShow: 'pop-in'
      },
      styles: {
        popGesture: 'hide'
      },
      waiting: {
        autoShow: false
      },
      extras: {
        catergoryid: data.id
      }
    });
  }
  // 跳转普通列表
  vm.list = function ( data ){
    mui.openWindow({
      id:'KZ_SHOP_LIST',
      url: './list.html',
      show: {
        aniShow: 'pop-in'
      },
      styles: {
        popGesture: 'hide'
      },
      waiting: {
        autoShow: false
      },
      extras: {
        catergoryid: data.id
      }
    });
  }
   // 跳转搜索列表
  vm.listSearch = function ( data ){
    mui.openWindow({
      id:'KZ_SHOP_SEARCH_LIST',
      url: './list-search.html',
      show: {
        aniShow: 'pop-in'
      },
      styles: {
        popGesture: 'hide'
      },
      waiting: {
        autoShow: false
      },
      extras: {
        catergoryid: data.id
      }
    });
  }
  
  // 跳转详情
        vm.toDetail = function ( data ){
 
          mui.openWindow({
            id:'KZ_SHOP_DETAIL',
      url: './detail.html',
      show: {
        aniShow: 'pop-in'
      },
      styles: {
        popGesture: 'hide'
      },
      waiting: {
        autoShow: false
      },
      extras: {
        catergoryid: data.id,
        headtitle: data.title
      }
    });
  }
 
}