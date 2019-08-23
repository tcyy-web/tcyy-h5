;
(function(w){
  var tcyy_base_file_root = "_doc/tcyy/camera/";
  w.upload = {
    	//选取图片的来源，拍照和相册 
    	showImgActionSheet:function(fnend) {
    		var divid =  Date.now();
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
    	//视频选择
    	showVedioActionSheet:function(callback) {
    		var divid = Date.now();
      var actionbuttons = [{
        title: "录像"
      }, {
        title: "本地选取"
      }];
      var actionstyle = {
        title: "选择视频",
        cancel: "取消",
        buttons: actionbuttons
      };
      var _this = this;
      plus.nativeUI.actionSheet(actionstyle, function(e) {
        if(e.index == 1) {
          _this.getVideo(callback);
        } else if(e.index == 2) {
          _this.galleryVideo(callback);
        }
      });
    	},
    	//相册选取图片
    	galleryImg:function(divid , fnend) {
    		var _this = this;
    		plus.gallery.pick(function(p) {
    		  _this.compressImage(p, divid , fnend);
    		}, function(e) {
    		  console.log('打开相册失败：'+e.message);
    		}, {
    			filename: tcyy_base_file_root,
    			filter: "image",
    			multiple: false
    		});
    	},
    	//选取视频
    	galleryVideo:function(fnend) {
    		var _this = this;
      plus.gallery.pick(function(file) { //打开相册后，回调的文件路径e
        fnend(file);
      }, function(e) {
      }, {
        filename: tcyy_base_file_root,
        filter: "video", //只打开视频，但是不知道为什么有其他选项
        system: false//不用系统自带的打开相册功能
      });
    	},
    	// 拍照
    	getImage:function(divid , fnend) {
    		var _this = this;
    		var cmr = plus.camera.getCamera(1);
    		cmr.captureImage(function(path) {
    		  _this.compressImage(path, divid , fnend);
    		}, function(e) {
    		}, {
    			filename: tcyy_base_file_root,
    			index: 1
    		});
    	},
    	// 录像
    	getVideo: function(fnend){
    	  var _this = this;
    	  var cmr = plus.camera.getCamera();
      var res = cmr.supportedVideoResolutions[0]; //获取支持的分辨率，拿默认的第一个
      var fmt = cmr.supportedVideoFormats[0]; //获取支持的录像文件格式，拿默认的第一个
      cmr.startVideoCapture(function(file) { //录像成功后会返回一个路径到e这里
        plus.io.resolveLocalFileSystemURL(file, function(entry) { //这个是根据路径读取文件信息，其实这步可以省略。
          fnend(file);
        }, function(e) {
          mui.toast('读取录像文件出错');
        });
      }, function(error) {
      },  {
        filename: tcyy_base_file_root,
        resolution: res,
        format: fmt
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
    			quality: 60, //quality: (Number 类型 )压缩图片的质量.取值范围为1-100
    			overwrite: true //overwrite: (Boolean 类型 )覆盖生成新文件
    		},
    		function(event) {
    		  var absolutePath = event.target;
    			_this.saveimage(absolutePath,zippath, divid,fnend);
    		},
    		function(error) {
    			console.log("压缩图片失败，请稍候再试");
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
    		  type: '1', // 默认项目图片 1 ，头像 2， 病例秀 3 ，患者图片 4， 在线课堂 5 ，图片库 6
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
  		//上传Media
    	uploadMedia: function(url, back, data) {
      var code = '';
      if (w.authManage) {
        var user = w.authManage.getUser();
        code = user.code || '';
      }
    		var defaults = {
    		  type: '6', 
    		  filetype: '2', //视频
    		  code: code
    		};
    		if(data) {
    		  mui.extend(true, defaults, data);
    		}
    		var opt = {
    			url:url,
    			data: defaults,
    			back:back
    		}
  		  console.log('***********上传地址:'+opt.url);
        console.log('***********上传参数:'+JSON.stringify(opt.data));
    		var wa = plus.nativeUI.showWaiting();
    		var task = plus.uploader.createUpload(opt.url , {
    			method: "POST"
    		},function(t, status) {
    		  wa.close();
    		  console.log('***********上传返回:'+t.responseText);
    			if(t.state === 4 && status == 200) {
    			  try{
    			    var res = JSON.parse(t.responseText);
              if (res.header.status === 2001) {
                typeof opt.back =="function" && opt.back( res.body );
              } else {
                mui.toast('上传失败，失败原因：'+res.header.msg);
                console.log('上传失败，失败原因：'+res.header.msg);
              }
    			  }catch(e){
    			    mui.toast('上传失败, 文件过大或不符合要求');
    			  }
    			  
    			} else {
  			    mui.toast('上传失败');
    			}
    		});
    		var fileurl = data.abspath;
      task.addFile(fileurl, {});
    		if (opt.data) {
        for (var key in  opt.data) {
          task.addData(key, opt.data[key]);
        }
    		}
    		task.start();
    	},
    	// 上传图片
    	uploadfile : function ( opt ){
      console.log('***********上传地址:'+opt.url);
      console.log('***********上传参数:'+JSON.stringify(opt.data));
      var itemkey = "img-" + opt.divid;
      var itemvalue = plus.storage.getItem(itemkey);
      if (itemvalue === null) {
        console.log('请选择文件');
        return;
      }
    		var wa = plus.nativeUI.showWaiting();
    		var task = plus.uploader.createUpload( opt.url , {
    			method: "POST"
    		},function(t, status) {
    		  wa.close();
    		  console.log('***********上传返回:'+t.responseText);
    		  console.log(status);
          console.log(JSON.stringify(t));
    			if(t.state === 4 && status == 200) {
    			  try{
    			    var res = JSON.parse(t.responseText);
              if (res.header.status === 2001) {
                typeof opt.back =="function" && opt.back( res.body );
              } else {
                mui.toast('上传失败，失败原因：'+res.header.msg);
                console.log('上传失败，失败原因：'+res.header.msg);
              }
    			  } catch(e){
    			    mui.toast('上传失败, 文件过大或不符合要求');
    			  }
    			 
    			} else {
    				 mui.toast('上传失败');
    			}
    		});
    		var _itemvalue = JSON.parse(itemvalue);
    		var fileurl = _itemvalue.abspath;
      task.addFile(fileurl, {
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
