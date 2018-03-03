// 监听plusready事件  
document.addEventListener( "plusready", function(){
	
	var info = plus.push.getClientInfo();
	
	console.log( "token: "+info.token );
	console.log( "clientid: "+info.clientid );
	console.log( "appid: "+info.appid );

	// 监听点击消息事件
	plus.push.addEventListener( "click", function( msg ) {
		
		// 处理其它数据
		doWithMsg( msg );
	}, false );
	// 监听在线消息事件
	plus.push.addEventListener( "receive", function( msg ) {
		
		doWithMsg( msg );
	}, false );
}, false );

function doWithMsg( msg ) {

	if ( msg.payload || msg.aps) {
		 mui.openWindow({
          url: '../my/my-message.html',
          id: 'MY-MESSAGE',
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
//		var data = msg.payload;
//		if ( typeof(msg.payload)=="string" ) {
//			data = JSON.parse( data );
//		}
//		var url = "";
//		switch( data.type ) {
//			case "1":
//				url = '';//进入关注列表
//			break;
//			case "2":
//				url = '';//进入病例秀
//			break;
//			case "3":
//				url = '';//进入病课堂评论
//			break;
//			case "4":
//				url = '';//进入文章详情页
//			break;
//			case "5":
//				url = '';//进入消息列表
//			break;
//			case "6":
//				url = '';//进入点赞列表
//			break;
//
//			default:
//				url = data.url;//进入关注列表
//			break;
//		}
//		
//		if( !url){ return ;}
//		
//		$.openWindow({
//	        url: url,
//	        id: "NewWidow"+data.type,
//	        show: {
//	          aniShow: 'pop-in'
//	        },
//	        styles: {
//	          popGesture: 'hide'
//	        },
//	        waiting: {
//	          autoShow: false
//	        }
//	    });
	}
	
	if ( msg.aps ) {
		
	}
}