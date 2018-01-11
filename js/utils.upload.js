;
(function(w){
w.upload = {
	//选取图片的来源，拍照和相册 
	showImgActionSheet:function(target , fnend) {
		var divid = target.id;
		var actionbuttons = [{
			title: "拍照"
		}, {
			title: "相册选取"
		}];
		var actionstyle = {
			title: "选择照片",
			cancel: "取消",
			buttons: actionbuttons
		};
		var _this = this;
		plus.nativeUI.actionSheet(actionstyle, function(e) {
			if(e.index == 1) {
				_this.getImage(divid , fnend);
			} else if(e.index == 2) {
				_this.galleryImg(divid , fnend);
			}
		});
	},
	//相册选取图片
	galleryImg:function(divid , fnend) {
		var _this = this;
		plus.gallery.pick(function(p) {
		  _this.compressImage(p, divid , fnend);
//			plus.io.resolveLocalFileSystemURL(p, function(entry) {
//				_this.compressImage(entry.toLocalURL(), entry.name, divid , fnend);
//			}, function(e) {
//				plus.nativeUI.toast("读取拍照文件错误：" + e.message);
//			});
		}, function(e) {
		  mui.toast('打开相册失败：'+e.message);
		}, {
			filename: "_doc/tcyy/camera/",
			filter: "image",
			multiple: false
		});
	},
	// 拍照
	getImage:function(divid , fnend) {
		var _this = this;
		var cmr = plus.camera.getCamera(1);
		cmr.captureImage(function(path) {
		  _this.compressImage(path, divid , fnend);
//			plus.io.resolveLocalFileSystemURL(path, function(entry) {
////				_this.compressImage(entry.toLocalURL(), entry.name, divid , fnend);
//			}, function(e) {
//				plus.nativeUI.toast("读取拍照文件错误：" + e.message);
//			});
		}, function(e) {
		}, {
			filename: "_doc/tcyy/camera/",
			index: 1
		});
	},
	//压缩图片
	compressImage:function(path, divid , fnend) {
		var _this = this;
		var date = new Date().getTime();
		var filetype = path.substring(path.indexOf("."), path.length);
		var zippath = "_doc/tcyy/upload/img-" + date + filetype; 
		plus.zip.compressImage({
			src: path, //src: (String 类型 )压缩转换原始图片的路径
			dst: zippath, //压缩转换目标图片的路径
			quality: 40, //quality: (Number 类型 )压缩图片的质量.取值范围为1-100
			overwrite: true //overwrite: (Boolean 类型 )覆盖生成新文件
		},
		function(event) {
		  var absolutePath = event.target;
			_this.saveimage(absolutePath,zippath, divid,fnend);
		},
		function(error) {
			mui.toast("压缩图片失败，请稍候再试");
		});
	},
	//保存信息到本地
	/**
	 *
	 * @param {Object} url  图片的地址
	 * @param {Object} divid  字段的名称
	 * @param {Object} name   图片的名称
	 */
	saveimage:function(absolutePath,path, divid , fnend ) {
		var itemname = "img-" + divid;
		var data = {
      abspath: absolutePath,
      divid:divid,
      path: path
    };
		var itemvalue = JSON.stringify(data);
		plus.storage.removeItem(itemname);
		plus.storage.setItem(itemname, itemvalue);
		typeof fnend =="function" && fnend(data);
	},
	//上传图片
	uploadimge: function( url , divid , back, data) {
	  var code = '';
    if (w.authManage) {
      var user = w.authManage.getUser();
      code = user.code || '';
    }
		var defaults = {
		  type: '1', // 默认项目图片 1 
		  filetype: '1', // 图片
		  code: code
		};
		if(data) {
		  mui.extend(true, defaults, data);
		}
		this.uploadfile({
			url:url,
			data: defaults,
			divid:divid,
			back:back
		})
	},
	uploadfile : function ( opt ){
    console.log('***********上传地址:'+opt.url);
    console.log('***********上传参数:'+JSON.stringify(opt.data));
    var itemkey = "img-" + opt.divid;
    var itemvalue = plus.storage.getItem(itemkey);
    if (itemvalue === null) {
      mui.toast('请选择文件');
      return;
    }
		var wa = plus.nativeUI.showWaiting();
		var task = plus.uploader.createUpload( opt.url , {
				method: "POST"
			},
			function(t, status) {
			  wa.close();
			  console.log('***********上传返回:'+t.responseText);
				if(t.state === 4 && status == 200) {
				  var res = JSON.parse(t.responseText);
				  if (res.header.status === 2001) {
				    typeof opt.back =="function" && opt.back( res.body );
				  } else {
				    mui.toast('上传失败，失败原因：'+res.header.msg);
				  }
				} else {
					mui.toast("上传失败");
				}
			}
		);
		var _itemvalue = JSON.parse(itemvalue);
		var fileurl = _itemvalue.abspath;
    task.addFile(fileurl, {
//    key: 'files',
//    name: '1111',
//    mime: 'image/jpeg'
    });
		if (opt.data) {
      for (var key in  opt.data) {
        task.addData(key, opt.data[key]);
      }
		}
		task.start();
	}
}
})(window);
