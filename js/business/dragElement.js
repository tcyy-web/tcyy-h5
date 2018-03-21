
window._index = 100;
window._now_target = null;

window.reqAnimationFrame = (function() {
	return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();
	
function Drag( target ){
	this.transform = {}; //图像效果
	this.timer = null;
	this.initAngle = 0; //旋转角度
	
	this.preAngle = 45;
	this.initScale = 1; //放大倍数

	this.target = target;
	
	this.index = _index++;
	
	this.START_X = 0;
	this.START_Y = 0;

}


Drag.prototype = {
	
	init: function(){
		this.setLocation();
		this.resetElement();
		
		this.setIndex();
		this.addEvent();
	},
	
	
	
	
	setLocation: function(){
		this.width = this.target.width();
		this.height = this.target.height();
		var win_width = $(window).width(),win_height = $(window).height();
		
		var left = (win_width - this.width)/2, top = (win_height - this.height)/2
		
		this.START_X = left;
		this.START_Y = top;

	},
	setIndex: function(){
		
		this.index = _index++;
		
		this.requestElementUpdate();
	},
	

	addEvent: function(){
		
		var self = this;
		
		var mc = new Hammer.Manager( this.target.find("p")[0] , {
			recognizers: [
				[Hammer.Pan,{
					threshold: 0,
					pointers: 0
				}],
				[Hammer.Tap],
				[Hammer.Tap,{
					 event: 'doubletap', taps: 2
				}],
				[Hammer.Press],
				
				[Hammer.Rotate,{
					threshold: 0
				},['pan']],
				
				[Hammer.Pinch,{
					threshold: 0
				},['pan','rotate']],
			]
		} );
		
		
		var mcClose = new Hammer(this.target.find("i")[0]);
	
		
		//结束时做一些处理
		mc.on("hammer.input", function(ev) {
			if(ev.isFinal) {

				self.START_X = self.transform.translate.x;
				self.START_Y = self.transform.translate.y;
			}
	
		});
	
		
		mc.on("panstart panmove", self.onPan.bind(self));
	
//		mc.on("doubletap", self.doubleTap.bind( self ) );

		mc.on("press", self.onPress.bind( self ));
		
		mc.on("tap", self.onTap.bind( self ));
		
		mc.on("pinchstart pinchmove", self.onPinch.bind( self ) );
		
		mc.on("rotatestart rotatemove rotateend", self.onRotate.bind( self ) );
		
		mcClose.on("panstart panmove panend", self.oniPanChange.bind(self));
	
	},
	
	onRotate : function (ev) {

		//点下第二个触控点时触发
		if(ev.type == 'rotatestart') {
			
			this.startRotateAngle = ev.rotation;
			
			this.tempAngleFlag = 0;
			
			_now_target = this.target;
		}
		if(ev.type == 'rotatemove') {
			
			if( this.tempAngleFlag == 0) {
				this.preAngle2 = this.startRotateAngle ;
				this.tempAngleFlag++;
			} else {
				this.deltaAngle = ev.rotation  - this.preAngle2;
				
//				this.transform.rz = 1; //非0  垂直xy轴
				this.transform.angle = this.initAngle + this.deltaAngle;
				this.requestElementUpdate();
			}
		}

		//旋转结束  记录当前图片角度	
		if(ev.type == 'rotateend') {
			this.initAngle = this.transform.angle;
			
		}
	},
	
	onPinch:function(ev) {
		
		_now_target = this.target;
		
		if(ev.type == 'pinchstart') {
			this.initScale = this.transform.scale || 1;
		}
		
		this.transform.scale = this.initScale * ev.scale;
		
		this.requestElementUpdate();
	},
	
	onTap: function( ev ){
		var target = this.target;
		
		$(".delete").hide();
		
		if( $(target).hasClass("taped") ){
			$(target).removeClass("taped");
			
			_now_target = this.target;
			return;
		}
		
		$(".opt_img").removeClass("taped");
		$(target).addClass("taped");
		this.setIndex();
	},
	

	onPan: function( ev ){
		this.transform.translate = {
			x: this.START_X + ev.deltaX,
			y: this.START_Y + ev.deltaY
		};
		this.requestElementUpdate();
	},
	
	onPress: function( ev ){
		
		$(".delete").css({
			"left": ev.center.x-100,
			"top": ev.center.y-20,
			"z-index":_index+10
		}).show();
	},

	doubleTap:function(){
		this.target.remove();
	},
	
	oniPanChange: function( ev ){
		
		var self = this;


		if( ev.type =="panstart"){
			
			this.initAngle = this.preAngle;
			
		}else if( ev.type =="panmove"){
			
			var _x = this.transform.translate.x+this.width/2 , _y = this.transform.translate.y+this.height/2;
				
			var l_y = ev.center.y, l_x = ev.center.x;
			
			var len = Math.sqrt( (l_x-_x)*(l_x -_x) +(l_y-_y)*(l_y-_y));
			
			var sLen = Math.sqrt(this.width*this.width + this.height * this.height )/2;
	
			
			this.scale =  len / sLen; 
			
			var tempScale =  this.scale;

			
//			if( tempScale> 2 ){ tempScale = 2; }
			
			if( tempScale < 0.4){ tempScale = 0.4; }
			
			this.transform.scale = tempScale ;


			var deg = Math.atan2( l_y - _y, l_x- _x ) * 180 / Math.PI;
	
			this._temp =  this.initAngle + deg;

			this.transform.angle = this._temp;

		}else if( ev.type =="panend"){
			this.initScale = tempScale;
			this.initAngle = this.transform.angle;
		}
		this.requestElementUpdate();
		
	},
	
	updateElementTransform: function(){
	
		var value = [
			'translate3d(' + this.transform.translate.x + 'px, ' + this.transform.translate.y + 'px, 0)',
			'scale(' + this.transform.scale + ', ' + this.transform.scale + ')',
//			'rotate3d(' + this.transform.rx + ',' + this.transform.ry + ',' + this.transform.rz + ',' + this.transform.angle + 'deg)'
			'rotate(' + this.transform.angle + 'deg)'
		];
		
		var tgt = this.target[0];
		
		value = value.join(" ");
		
		tgt.style.webkitTransform = value; /*为Chrome/Safari*/
		tgt.style.mozTransform = value; /*为Firefox*/
		tgt.style.transform = value; /*IE Opera?*/
		tgt.style.zIndex = this.index;
		
		var iScale = 1/this.transform.scale;
		
		this.target.find("i").css({
			transform:'scale(' +  iScale + ', ' + iScale + ')'
		})
		
		$(".delete").hide();
		
		_now_target = this.target;
		
		this.ticking = false;
		
	},
	requestElementUpdate: function () {
		var self = this;
		if(!this.ticking) {
			reqAnimationFrame( self.updateElementTransform.bind( self ) );
			this.ticking = true;
		}
	},
	resetElement:function(){
		this.transform = {
			translate: {
				x: this.START_X,
				y: this.START_Y
			},
			scale: 1,
			angle: 0,
			rx: 0,
			ry: 0,
			rz: 0
		}
		
		
		this.requestElementUpdate();
	}
}


