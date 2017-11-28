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
	
	
})