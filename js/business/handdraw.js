;
(function($) {

	var canvas = document.getElementById("canvas")
	var bgCanvas = document.getElementById("bg");
	var context = canvas.getContext("2d");
	// 验证会员
  var vipflag = null;
  var checkVip = function(callback) {
    if (vipflag == null) {
      request.loginAjax('user/getVip', {
        showLoading: false,
        showMsg: false
      }, function(data, success) {
         if (success) {
           if (data.isend == 1) {
             callback();
             return;
           }
         }
         mui.toast('请开通会员');
      }, function() {
        mui.toast('请开通会员');
      });
    } else if (vipflag == true) {
      callback();
    } else {
      mui.toast('请开通会员');
    }
  }

    // polyfill 提供了这个方法用来获取设备的 pixel ratio
    var getPixelRatio = function(context) {
        var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;
    
        return (window.devicePixelRatio || 1) / backingStore;
    };

    var ratio = getPixelRatio(context);
    
    $(".container").css({
    	"zoom":1/ratio
    })
	

	var lastLoc = {
		x: 0,
		y: 0
	};
	var strokeColor = "#000";
	var lineWidth = 1;
	
	var historyArr = [];// 储存历史记录img
	var now_his_index = -1;

	clearHB(canvas);
	addEventListener();

	function changeColor(color) {
		strokeColor = color || "#000";
	}

	function clearHB(canvas) {

		canvas.width = canvas.width;
	}
	
	function undo(){
		if(now_his_index>=0){
			now_his_index--;
			clearHB( canvas );
			if(now_his_index!=-1){
				drawImage( canvas , historyArr[now_his_index] );
			}
		}
		
	}

	function drawImage(canvas, src , left , top) {
		var context = canvas.getContext("2d");
		var image = new Image();
		image.src = src;
		image.onload = function() {
			
			context.drawImage(image, left*ratio||0, top*ratio||0, canvas.width-(left||0)*ratio, canvas.height-(top||0)*ratio);
		}
	}

	function getEvent(event, type) {
		
		if(!event.originalEvent&&!event.changedTouches){
			return 0;
		}

		if(type == "x") {
			var x = event.clientX || event.originalEvent ? event.originalEvent.changedTouches[0].clientX : event.changedTouches[0].clientX;
			return x*ratio;
		}

		if(type == "y") {
			y = event.clientY || event.originalEvent ? event.originalEvent.changedTouches[0].clientY : event.changedTouches[0].clientY;
			return y*ratio
		}
	}

	function canZoom(x, y, width, height) {
		var rate = 4 / 5;
		if(x > width * rate && y > height * rate) {
			return true;
		}
		return false;
	}
	
	
	function renderBgData (){
		
    	if(!window._yanshi_bg){
    		ajaxBgData();
    	}else{
    		renderBgList( window._yanshi_bg);
    	}

    }
    function renderBgList(data){
//  	if($(".center_opt").find("li").length!=0){ return false;}
    	var st = "";
    	for(var i = 0; i<data.length; i++){
    		st += "<li><img src='"+data[i].image+"'/></li>";
    	}
    	st+="<li class='clearfix'></li>";
    	$(".center_opt").html( st );
    }
    function ajaxBgData(){

    	request.ajax('domes/getBgList', {showMsg: false }, function(data, success) {
      	
      	  if ( success ){
      	    window._yanshi_bg = data;
      	    renderBgList( data )
      	  }
      	});
    }
    
    function drawBg(){
    	var link = $("body").attr("src");
		drawImage(bgCanvas,link , 60 , 48);
    }

	function addEventListener() {
		
		var render = function(){
			_w = $(window).width();
			_h = $(window).height();
			
//			canvas.style.width = _w;
//			canvas.style.height = _h;
//			
//			bgCanvas.style.width = _w;
//			bgCanvas.style.height = _h;
			
			bgCanvas.width = canvas.width = _w*ratio ;
			bgCanvas.height = canvas.height = _h*ratio ;

			
			drawBg();
		}
		$(window).on("resize",function(){
			render();
			
		})
		
		$(function(){
			render();
		})

		$("#file").on("change", function() {

			var file = this.files[0];
			var reader = new FileReader();
			console.log(file.type);
			reader.addEventListener("load", function() {

				drawImage(canvas, reader.result);
			}, false);

			var filter = file.type.match(/jpg|jpeg|gif|bmp|png/ig);

			if(file && filter) {
				reader.readAsDataURL(file);
			} else {
				console.log("文件类型不对");
			}

		})
		$(".controller").on("tap", "span", function() {
			$(this).addClass("current").siblings().removeClass("current");
			var color = $(this).attr("color");
			changeColor(color);
		});

		$(".opt").on("tap", ".clear", function() {

//			clearHB(canvas);
//			now_his_index = -1;
			
			undo();
			
		}).on("tap", ".undo", function() {
			undo();
			
		}).on("tap", ".file", function() {
			
			
			showFile();
			clearHB(canvas);
			now_his_index = -1;
		});
		
		function showFile(){
			var actionbuttons = [{
				title: "本地图库"
			}, {
				title: "在线图库"
			}];
			var actionstyle = {
				title: "选择照片",
				cancel: "取消",
				buttons: actionbuttons
			};
			var _this = this;
			plus.nativeUI.actionSheet(actionstyle, function(e) {
				if(e.index == 2) {
					renderBgData();
					$(".opt_img").remove();
					$(".center_opt").show();
				} 
				
				if(e.index == 1) {
				  checkVip(function(){
            plus.gallery.pick(function(p) {
              $(".center_opt").hide();
  
              $("body").attr("src",p);
              $(".opt_img").remove();
              drawBg();
              
            }, function(e) {
              console.log('打开视频库失败：'+e.message);
            });				    
				  })
				}
				
				
				if(e.index == 3) {
					console.log("cancel")
				}
			});
		}
		
		$(".center_opt").on("tap","li",function(){
			var img = $(this).find("img");
			var link = img.attr("src");
			$("body").attr("src",link);
			$(".center_opt").hide();
			drawBg();
		});
		$("body").on("tap", function() {

			$(".center_opt").hide();
		});
		
		var index = 2;
		
		$(".left_opt").on("click", ">li", function(e) {
			e.stopPropagation();
			e.preventDefault();
			var cid = $(this).attr("cid");
			var tar = null;
			for(var i in _yanshi_data) {
				var item = _yanshi_data[i];
				if(item.id == cid) {
					tar = item;
					break;
				}
			}
			
			var oChild = $(this).find(".left_opt2")
			if( !oChild.is(":hidden")){
				oChild.hide();
				return ;
			}
			renderLeftOpt2( tar["dome_image"] , oChild );
			$(".left_opt2").hide()
			oChild.show();
			
		}).on("click", ".left_opt2 li", function(e) {
			
			e.stopPropagation();
			e.preventDefault();
			
			var oImg = $(this).find("img");
			var sLink = oImg.attr("src");
			var w = oImg.width(),
				h = oImg.height();
			var l = ($(window).width() - w) / 2,
				t = ($(window).height() - h) / 2;
				
			var oTar = $("<div class='opt_img'><p><img src=" + sLink + "><b></b></p> <i></i> </div>").appendTo("body");
			oTar.css({
				"position": "absolute",
				"left": 0,
				"top":  0,
				"z-index": index++
			})
			
			var d = new Drag( oTar );
				d.init();
//			move(oTar[0])
		});

		function renderLeftOpt2(arr, tgt ) {
			var oList = [];
			
			for( var i in arr ) {
				var link = arr[i].image;
				oList.push("<li><img src=" + link + "></li>");
			}
			
			$(tgt).html( arr.length == 0 ? '' : oList.join(""));
		}
		

		$("body").on('tap', ".del", function() {
			$(this).parent().remove();
		})

		$(".mui-input-range input[type=range]").on("change", function() {
			lineWidth = parseInt($(this).val())
		})

		$("#wigget").on("touchstart", ".module", function(e) {
			$(this).addClass("current").siblings().removeClass("current");
			this.x = getEvent(e, "x");
			this.y = getEvent(e, "y");

			this.down = true;
			this.ismove = false;
			this.top = $(this).position().top;
			this.left = $(this).position().left;
			this.width = $(this).width();
			this.height = $(this).height();
			this.win_width = $(window).width();
			this.win_height = $(window).height();
			this.zoom = canZoom(this.x - this.left, this.y - this.top, this.width, this.height);

			e.preventDefault();
		}).on("touchend", ".module", function(e) {
			e.preventDefault();
			this.ismove && $(this).removeClass("current");
			this.down = false;
			this.zoom = false;
			var now = new Date().getTime();

			if(now - this.endtime < 500 && this.ismove === false && this.ismove2 === false) {
				$(this).remove();
			}

			this.endtime = now;
			this.ismove2 = this.ismove;
			this.ismove = false;
		}).on("touchmove", ".module", function(e) {
			e.preventDefault();
			var x = getEvent(e, "x");
			var y = getEvent(e, "y");
			var movex = this.left + x - this.x;
			var movey = this.top + y - this.y;
			if(this.down && !this.zoom) {
				this.ismove = true;
				movex = Math.min(movex, this.win_width - this.width);
				movey = Math.min(movey, this.win_height - this.height);
				movex = Math.max(0, movex);
				movey = Math.max(0, movey);
				$(this).css({
					left: movex,
					top: movey
				})
			} else if(this.down && this.zoom) {
				var now_width = this.width + x - this.x;
				var now_height = this.height + y - this.y;
				$(this).width(now_width).height(now_height);
			}
		})

		var isMouseDown = false;

		canvas.ontouchstart = canvas.onmousedown = function(e) {
			e.preventDefault();
			isMouseDown = true;

			var x = getEvent(e, "x");
			var y = getEvent(e, "y");

			var loc = windowToCanvas(x, y);

			lastLoc = loc;
		}

		canvas.ontouchend = canvas.onmouseup = canvas.onmouseout = function(e) {
			e.preventDefault();
			if( isMouseDown ){
				now_his_index++;
				historyArr[now_his_index] = canvas.toDataURL('image/png');
			}

			isMouseDown = false;
		}

		canvas.ontouchmove = canvas.onmousemove = function(e) {
			e.preventDefault();

			if(isMouseDown) {

				var x = getEvent(e, "x");
				var y = getEvent(e, "y");

				var curLoc = windowToCanvas(x, y);

				context.beginPath();

				context.moveTo(lastLoc.x, lastLoc.y)
				context.lineTo(curLoc.x, curLoc.y);

				context.save();
				context.strokeStyle = strokeColor;
				context.lineWidth = lineWidth*ratio;
				context.lineCap = "round";

				context.stroke();
				context.restore();

				lastLoc = curLoc;
			}
		}
	}

	function calcDistance(p, p2) {
		return Math.sqrt((p2.x - p.x) * (p2.x - p.x) + (p2.y - p.y) * (p2.y - p.y))
	}

	function windowToCanvas(x, y) {
		var bbox = canvas.getBoundingClientRect();
		return {
			x: Math.round(x - bbox.left),
			y: Math.round(y - bbox.top)
		};
	}

	function pathDottedLine(ctx, x1, y1, x2, y2, lineLen) {

		ctx.beginPath();

		var space = lineLen / 2;

		var tc = dis(x1, y1, x2, y2),
			disX = x2 - x1;

		var angle = Math.asin(disX / tc);

		if(tc == 0) return;

		for(var i = 0; i <= tc / (lineLen + space) - 2; i++) {

			var sLen = lineLen * (i + 1) + space * i;
			var eLen = lineLen * (i + 2) + space * i;

			var sX = x1 + Math.sin(angle) * sLen;
			var sY = y1 + Math.cos(angle) * sLen;

			var eX = x1 + Math.sin(angle) * eLen;
			var eY = y1 + Math.cos(angle) * eLen;

			ctx.moveTo(sX, sY);
			ctx.lineTo(eX, eY);
		}
	}

	function dis(x1, y1, x2, y2) {

		return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
	}
})(jQuery);