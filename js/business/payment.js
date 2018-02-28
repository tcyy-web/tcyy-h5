var channel=null;
// 1. 获取支付通道
function plusReady(){
    // 获取支付通道
    plus.payment.getChannels(function(channels){
        channel=channels[0];
    },function(e){
        mui.toast("获取支付通道失败："+e.message);
    });
}

document.addEventListener('plusready',plusReady,false);

var ALIPAYSERVER='http://demo.dcloud.net.cn/helloh5/payment/alipay.php?total=';
var WXPAYSERVER='http://demo.dcloud.net.cn/helloh5/payment/wxpay.php?total=';
// 2. 发起支付请求
function pay(id){
    // 从服务器请求支付订单
    var PAYSERVER='';
    if(id=='alipay'){
        PAYSERVER=ALIPAYSERVER;
    }else if(id=='wxpay'){
        PAYSERVER=WXPAYSERVER;
    }else{

        return;
    }
    var xhr=new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        switch(xhr.readyState){
            case 4:
            if(xhr.status==200){
                plus.payment.request(channel,xhr.responseText,function(result){
                    plus.nativeUI.alert("支付成功！",function(){
                        back();
                    });
                },function(error){
                    plus.nativeUI.alert("支付失败：" + error.code);
                });
            }else{
                alert("获取订单信息失败！");
            }
            break;
            default:
            break;
        }
    }
    xhr.open('GET',PAYSERVER);
    xhr.send();
}