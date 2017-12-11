;
(function(w){
	w.uploadImg = {
		show: function() {
      var actionbuttons=[{title:"拍照"},{title:"相册选取"}];  
      var actionstyle={title:"选择照片",cancel:"取消",buttons:actionbuttons};  
      plus.nativeUI.actionSheet(actionstyle, function(e){  
            if(e.index==1){  
//                    getImage(divid);  
            }else if(e.index==2){  
//                    galleryImg();  
            }  
      }); 
		}
	}
})(window);
