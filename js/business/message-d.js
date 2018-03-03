function readyFuntion(){
	messageWebview = mui.preload({
	  	id: 'myMessageDetail2',
	    url: './my-message-detail.html'
	});
	

}

function showMsgDetail( data ){
	var type = data.type;
	var dataId = data.dataId;
	if( type  ){
		//默认消息
        mui.fire(messageWebview,'message-id',{
	       id:data.id
	    });
	    mui.openWindow({
          id: 'myMessageDetail2'
        });
	}
	
}
