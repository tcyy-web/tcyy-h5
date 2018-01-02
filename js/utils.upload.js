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
			//alert(p);//file:///storage/emulated/0/DCIM/Camera/IMG_20160704_112620.jpg
			plus.io.resolveLocalFileSystemURL(p, function(entry) {
				//alert(entry.toLocalURL());//file:///storage/emulated/0/DCIM/Camera/IMG_20160704_112620.jpg
				//alert(entry.name);//IMG_20160704_112620.jpg
				_this.compressImage(entry.toLocalURL(), entry.name, divid , fnend);
			}, function(e) {
				plus.nativeUI.toast("读取拍照文件错误：" + e.message);
			});
		}, function(e) {}, {
			filename: "_doc/camera/",
			filter: "image"
		});
	},
	// 拍照
	getImage:function(divid , fnend) {
		var _this = this;
		var cmr = plus.camera.getCamera();
		cmr.captureImage(function(p) {
			//alert(p);//_doc/camera/1467602809090.jpg
			plus.io.resolveLocalFileSystemURL(p, function(entry) {
				//alert(entry.toLocalURL());//file:///storage/emulated/0/Android/data/io.dcloud...../doc/camera/1467602809090.jpg
				//alert(entry.name);//1467602809090.jpg
				_this.compressImage(entry.toLocalURL(), entry.name, divid , fnend);
			}, function(e) {
				plus.nativeUI.toast("读取拍照文件错误：" + e.message);
			});
		}, function(e) {}, {
			filename: "_doc/camera/",
			index: 1
		});
	},
	//压缩图片
	compressImage:function(url, filename, divid , fnend) {
		var _this = this;
		var name = "_doc/upload/" + divid + "-" + filename; //_doc/upload/F_ZDDZZ-1467602809090.jpg
		plus.zip.compressImage({
			src: url, //src: (String 类型 )压缩转换原始图片的路径
			dst: name, //压缩转换目标图片的路径
			quality: 20, //quality: (Number 类型 )压缩图片的质量.取值范围为1-100
			overwrite: true //overwrite: (Boolean 类型 )覆盖生成新文件
		},
		function(event) {
			//uploadf(event.target,divid);
			var path = name; //压缩转换目标图片的路径
			//event.target获取压缩转换后的图片url路
			//filename图片名称
			_this.saveimage(event.target, divid, filename, path, fnend);
		},
		function(error) {
			plus.nativeUI.toast("压缩图片失败，请稍候再试");
		});
	},
	//保存信息到本地
	/**
	 *
	 * @param {Object} url  图片的地址
	 * @param {Object} divid  字段的名称
	 * @param {Object} name   图片的名称
	 */
	saveimage:function(url, divid, name, path , fnend ) {
		//alert(url);//file:///storage/emulated/0/Android/data/io.dcloud...../doc/upload/F_ZDDZZ-1467602809090.jpg
		//alert(path);//_doc/upload/F_ZDDZZ-1467602809090.jpg
		var state = 0;
		var wt = plus.nativeUI.showWaiting();
		//  plus.storage.clear();
		name = name.substring(0, name.indexOf(".")); //图片名称：1467602809090
		
		var itemname = "img-" + divid; //429img-F_ZDDZ
		var itemvalue = plus.storage.getItem(itemname);
		if(itemvalue == null) {
			itemvalue = "{" + name + "," + path + "," + url + "}"; //{IMG_20160704_112614,_doc/upload/F_ZDDZZ-IMG_20160704_112614.jpg,file:///storage/emulated/0/Android/data/io.dcloud...../doc/upload/F_ZDDZZ-1467602809090.jpg}
		} else {
			itemvalue = itemvalue + "{" + name + "," + path + "," + url + "}";
		}
		plus.storage.setItem(itemname, itemvalue);



		typeof fnend =="function" && fnend( {
			name:name, 
			divid:divid , 
			path:url
		} );
		wt.close();

	},
	//删除图片
	//imgId:图片名称：IMG_20160704_112614
	//imgkey:字段，例如F_ZDDZZ
	//ID：站点编号ID，例如429
	delimage:function(name, divid , fnend) {
		var itemname = "img-" + divid;
		
		var itemvalue = plus.storage.removeItem(itemname);
		typeof fnend =="function" && fnend();
		

	},
	//上传图片
	uploadimge: function( url , imgArray , back) {
		//plus.storage.clear();
//		var wa = plus.nativeUI.showWaiting();
		var DkeyNames = [];

		this.uploadfile({
			url:url,
			imgArray:imgArray,
			type:"image",
			back:back
		})
	},
	
	//上传视频
	uploadvedio: function( url , imgArray , back) {
		//plus.storage.clear();
		//var wa = plus.nativeUI.showWaiting();
		var DkeyNames = [];
		
		this.uploadfile({
			url:url,
			imgArray:imgArray,
			type:"vedio",
			back:back
		})
	},
	
	uploadfile : function ( opt ){
		var id = new Date().getTime();
		var imgArray = opt.imgArray;
		
		var type = opt.type;
		if(imgArray.length==0){ plus.nativeUI.toast("请选择图片！"); return false;}
		var wa = plus.nativeUI.showWaiting();
		
		var task = plus.uploader.createUpload( opt.url , {
				method: "POST"
			},
			function(t, status) {
	
				if(status == 200) {
					console.log("上传成功");
					wa.close();
					typeof opt.back =="function" && opt.back( t );
					
				} else {

					console.log("上传失败");
					wa.close();
				}

				
			}
		);
		
		console.log( JSON.stringify(opt) );
		task.addData("id", id);
	
		for(var i = 0; i < imgArray.length; i++) {
			var itemkey = id + "img-" + imgArray[i];
			if(plus.storage.getItem(itemkey) != null) {
				var itemvalue = plus.storage.getItem(itemkey).split("{");
				for(var img = 1; img < itemvalue.length; img++) {
					var imgname = itemvalue[img].substr(0, itemvalue[img].indexOf(","));
					var imgurl = itemvalue[img].substring(itemvalue[img].indexOf(",") + 1, itemvalue[img].lastIndexOf(","));
					task.addFile(imgurl, {
						key: imgurl
					});
				}
			}
		}
		task.addData( "file_type", type);
		task.start();
	}
}

})(window);
