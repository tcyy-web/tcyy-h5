$(function ()
{
	$('.main ul li').on('touchstart',function ()
	{
		var i = $(this).attr('title');
		var b = $(this).attr('title-dt');
		if(i && b)
		{
			let c = $('.layer').find('h4').html(i).parent().find('span').html(b).parents('.layer-parent').css('top','0');
			console.log(c)
			return true;
		}
		
		return false;
		
	})
	
	$('.off').on('touchstart',function ()
	{
		$('.layer-parent').css('top','-100%');
	})
	
	$('.sex').on('touchstart',function ()
	{
		$('.sex-zzc').css('top','0')
	})
	
	$('.mm').on('touchstart',function ()
	{
		$('.mm').css('color','#000000').find('.sex-btn').css('right','-100%')
		$(this).css('color','#16ad60').find('.sex-btn').css('right','15px');
	})
	
	$('.sex-btn').on('touchstart',function ()
	{
		var sex = $(this).parent().find('span').html();
		
		console.log(typeof sex)
		
		$('.sex span').eq('1').html(sex);
		$('.sex-zzc').css('top','100%')
	})
	
	$('.sex-off').on('touchstart',function ()
	{
		$('.sex-zzc').css('top','100%')
	})
	
})
