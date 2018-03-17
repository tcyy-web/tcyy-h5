
window._index = 100;

window.reqAnimationFrame = (function() {
	return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();
	
function Drag( target ){
	this.transform = {}; //图像效果
	this.timer = null;
	this.initAngle = 0; //旋转角度
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
		
		var mc = new Hammer.Manager(this.target.find("p")[0]);
		
		var mcClose = new Hammer.Manager(this.target.find("i")[0]);
		
		mc.add(new Hammer.Pan({
			threshold: 0,
			pointers: 0
		}));
		
		mcClose.add(new Hammer.Pan({
			threshold: 0,
			pointers: 0
		}));
		
		//结束时做一些处理
		mc.on("hammer.input", function(ev) {
			if(ev.isFinal) {

				self.START_X = self.transform.translate.x;
				self.START_Y = self.transform.translate.y;
			}
	
		});
		
		mc.on("panstart panmove", self.onPan.bind(self));
		
		mcClose.on("panstart panmove", self.onPanClose.bind(self));
		
		
		
		$(this.target).on("tap",function( ev ){
			
			$(".opt_img").removeClass("taped");
			$(this).addClass("taped");
			self.setIndex();
		}).on("tap","i",function(ev){
			ev.stopPropagation();
			
		});
		
		
		
	},
	onPan: function( ev ){
		this.transform.translate = {
			x: this.START_X + ev.deltaX,
			y: this.START_Y + ev.deltaY
		};
		this.requestElementUpdate();
	},
	
	onPanClose: function( ev ){
		var y = Math.sqrt( this.width/2 * this.width/2 + this.height/2 * this.height/2 );
		var cal_x = this.width/2 + ev.deltaX , cal_y = this.height/2 + ev.deltaY;
		var x = Math.sqrt( cal_x*cal_x + cal_y*cal_y)
		this.scale =  (this.width + ev.deltaX)/this.width; 
		
		this.transform.scale = this.initScale * this.scale;
		console.log( this.scale )
//		console.log( ev.deltaX , ev.deltaY)
		this.requestElementUpdate();
		
	},
	
	updateElementTransform: function(){
	
		var value = [
			'translate3d(' + this.transform.translate.x + 'px, ' + this.transform.translate.y + 'px, 0)',
			'scale(' + this.transform.scale + ', ' + this.transform.scale + ')',
			'rotate3d(' + this.transform.rx + ',' + this.transform.ry + ',' + this.transform.rz + ',' + this.transform.angle + 'deg)'
		];
		
		$(this.target).css(
			{
				"transform": value.join(" "),
				"z-index": this.index
			}
		)
		
		
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


