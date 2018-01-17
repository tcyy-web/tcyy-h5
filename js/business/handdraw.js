var win = getHeight();

var canvasWidth =  win.width;
var canvasHeight = win.height;


var canvas = document.getElementById("canvas")
var context = canvas.getContext("2d");

canvas.width = canvasWidth;
canvas.height  = canvasHeight;

var lastLoc = { x: 0 , y : 0} ;
var strokeColor = "#000";
var lineWidth = 2;


clearHB( canvas );
addEventListener();

function changeColor( color ){
  strokeColor = color||"#000";
}

function getHeight(){
  // 获取窗口宽度
  if (window.innerWidth)
  winWidth = window.innerWidth;
  else if ((document.body) && (document.body.clientWidth))
  winWidth = document.body.clientWidth;
  // 获取窗口高度
  if (window.innerHeight)
  winHeight = window.innerHeight;
  else if ((document.body) && (document.body.clientHeight))
  winHeight = document.body.clientHeight;
  // 通过深入 Document 内部对 body 进行检测，获取窗口大小
  if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)
  {
    winHeight = document.documentElement.clientHeight;
    winWidth = document.documentElement.clientWidth;
  }

  return { height: winHeight , width: winWidth }
}

function clearHB( canvas ){
  
//	context.fillStyle = "#fff";
//	context.fillRect( 0 , 0 , canvasWidth , canvasHeight );
	canvas.width = canvas.width;
}

function drawImage( canvas , src ){
  var context = canvas.getContext("2d");
  var image = new Image();
  image.src = src;
  image.onload = function(){
    context.drawImage( image, 0 , 0 , canvas.width, canvas.height );
  }
}


function getEvent( event , type ){
  
  if( type =="x" ){
    return event.clientX|| event.originalEvent? event.originalEvent.changedTouches[0].clientX: event.changedTouches[0].clientX;
  }

  if( type =="y" ){
    return event.clientY|| event.originalEvent? event.originalEvent.changedTouches[0].clientY: event.changedTouches[0].clientY ;
  }
}

function canZoom( x, y , width , height ){
  var rate = 4/5;
  if( x> width * rate && y > height * rate){
    return true;
  }
  return false;
}

function addEventListener(){

  $("#file").on("change",function(){

    var file = this.files[0];
    var reader  = new FileReader();
    console.log( file.type );
    reader.addEventListener("load", function () {

      drawImage( canvas , reader.result );
    }, false);

    var filter = file.type.match(/jpg|jpeg|gif|bmp|png/ig);

    if (file && filter) {
      reader.readAsDataURL(file);
    }else{
      console.log("文件类型不对");
    }

  })
  $(".controller").on("tap","span",function(){
    $(this).addClass("current").siblings().removeClass("current");
    var color = $(this).attr("color");
    changeColor( color );
  });
  
  $(".opt").on("tap",".clear",function(){

    clearHB( canvas );
  });
  $("body").on("tap",function(){
//	$(".left_opt2").hide();
  });

  $(".left_opt").on("tap","li",function( e ){
  	e.stopPropagation();
  	var cid = $(this).attr("cid");
  	var tar = null;
  	for( var i in _yanshi_data){
  		var item = _yanshi_data[i];
  		if( item.id == cid){
  			tar = item;
  			break;
  		}
  	}
  	
  	renderLeftOpt2( tar["dome_image"]);
  	$(".left_opt2").show();
  })
  
  function renderLeftOpt2( arr ){
  	var oList = [];
  	for( var i in arr){
  		var link = arr[i].image;
  		oList.push("<li><img src="+link+"></li>");
  	}
  	$(".left_opt2").html( arr.length==0?'':oList.join(""));
  }
  var index = 2;
  $(".left_opt2").on("tap","li",function( e ){
  	e.stopPropagation();
  	var oImg = $(this).find("img");
  	var sLink = oImg.attr("src");
  	var w = oImg.width(), h = oImg.height();
  	var l = ($(window).width()-w)/2 , t = ($(window).height()-h)/2;
		var oTar = $("<div class='opt_img'><img width='100%' height='100%' src="+sLink+"></div>").appendTo("body");
		oTar.css({
			"position":"absolute",
			"left":0,
			"top":0,
			"width":w,
			"height":h,
			"z-index":index++
		})
  	$(".left_opt2").hide();
  	move(oTar[0])
  });
  
  $("body").on('tap',".del",function(){
  	$(this).parent().remove();
  })
  
  $(".mui-input-range input[type=range]").on("change",function(){
  	lineWidth = parseInt( $(this).val() )
  })

  $("#wigget").on("touchstart",".module",function( e ){
    $(this).addClass("current").siblings().removeClass("current");
    this.x = getEvent( e , "x");
    this.y = getEvent( e , "y");


    this.down = true;
    this.ismove = false;
    this.top = $(this).position().top;
    this.left = $(this).position().left;
    this.width = $(this).width();
    this.height = $(this).height();
    this.win_width = $(window).width();
    this.win_height = $(window).height();
    this.zoom = canZoom( this.x-this.left , this.y-this.top, this.width , this.height );

    e.preventDefault();
  }).on("touchend",".module",function( e ){
    e.preventDefault();
    this.ismove&&$(this).removeClass("current");
    this.down = false;
    this.zoom = false;
    var now = new Date().getTime();

    if( now - this.endtime <500 &&this.ismove===false && this.ismove2 === false ){
      $(this).remove();
    }

    
    this.endtime = now;
    this.ismove2 = this.ismove;
    this.ismove = false;
  }).on("touchmove",".module",function( e ){
    e.preventDefault();
    var x = getEvent( e , "x");
    var y = getEvent( e , "y");
    var movex = this.left+ x-this.x; 
    var movey = this.top + y-this.y;
    if( this.down&&!this.zoom ){
      this.ismove = true;
      movex = Math.min(movex , this.win_width - this.width ) ;
      movey = Math.min(movey , this.win_height - this.height ) ;
      movex = Math.max( 0 , movex );
      movey = Math.max( 0 , movey );
      $(this).css({left: movex ,top: movey })
    }else if(  this.down&&this.zoom){
      var now_width = this.width + x-this.x;
      var now_height = this.height + y-this.y; 
      $(this).width( now_width ).height( now_height );
    }
  })



  var isMouseDown = false;

  canvas.ontouchstart = canvas.onmousedown = function( e ){
    e.preventDefault();
    isMouseDown = true;

    var x = getEvent( e , "x");
    var y = getEvent( e , "y");

    var loc = windowToCanvas( x , y );

    lastLoc = loc;
  }

  canvas.ontouchend = canvas.onmouseup = canvas.onmouseout = function( e ){
    e.preventDefault();
    isMouseDown = false;
  }

  canvas.ontouchmove = canvas.onmousemove = function( e ){
    e.preventDefault();

    if( isMouseDown ){

      var x = getEvent( e , "x");
      var y = getEvent( e , "y");
  
      var curLoc = windowToCanvas( x , y );
      
      context.beginPath();

      context.moveTo( lastLoc.x ,lastLoc.y )
      context.lineTo( curLoc.x ,curLoc.y);

      context.save();
      context.strokeStyle = strokeColor;
      context.lineWidth = lineWidth;
      context.lineCap = "round";

      context.stroke();
      context.restore();

      lastLoc = curLoc;
    }
  }
}



function calcDistance( p , p2){
  return Math.sqrt( (p2.x - p.x) * (p2.x - p.x) + (p2.y - p.y) * (p2.y - p.y))
}


function windowToCanvas( x ,  y ){
  var bbox = canvas.getBoundingClientRect();
  return { x:  Math.round( x - bbox.left), y: Math.round(  y - bbox.top ) };
}



function pathDottedLine( ctx , x1 , y1 , x2 , y2 , lineLen ){

  ctx.beginPath();

  var space = lineLen / 2;
  
  var tc = dis( x1,  y1 , x2 , y2 ) , disX =   x2 - x1 ;
  
  var angle = Math.asin( disX / tc );

  if( tc ==0 ) return;


  for( var i  = 0 ; i <= tc /( lineLen + space) -2 ; i ++ ){

    var sLen  = lineLen * ( i + 1) + space * i ;
    var eLen  = lineLen * ( i + 2) + space * i ;

    var sX = x1 + Math.sin( angle) * sLen;
    var sY = y1 + Math.cos( angle) * sLen;

    var eX = x1 + Math.sin( angle) * eLen;
    var eY = y1 + Math.cos( angle) * eLen;

    ctx.moveTo( sX , sY );
    ctx.lineTo( eX ,eY);
  }
}


function dis( x1 , y1 , x2 , y2 ){

  return Math.sqrt( (x2 - x1 ) * (x2 - x1 ) + ( y2 - y1) * ( y2 - y1) ) ;
}



