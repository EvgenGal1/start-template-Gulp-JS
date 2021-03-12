$(document).ready(function() {
			var isMobile = {Android: function() {return navigator.userAgent.match(/Android/i);},BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i);},iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},Opera: function() {return navigator.userAgent.match(/Opera Mini/i);},Windows: function() {return navigator.userAgent.match(/IEMobile/i);},any: function() {return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());}};
	if(!isMobile.any()){
		$.each($('.zoom'), function(index, val) {
			$(this).append('<span class="zoom__body"></span><span class="zoom__lens"></span><span class="zoom__big"><span></span></span>');
				var tw=$(this).outerWidth();
				var th=$(this).outerHeight();
				var img=$(this).children('img');
				var src=$(this).attr('href');
				var lens=$(this).find('.zoom__lens');
				var big=$(this).find('.zoom__big');
			big.css({
				top:0,
				height:$(this).parents('.product__column').outerHeight(),
				left:$(this).outerWidth()+20,
				width:$(this).parents('.product__row').find('.product__body').outerWidth()
			});
			big.append('<img src="'+src+'" alt="">');

			$(this).find('.zoom__body').hover(function() {
				$('.product__body').addClass('active');
				$(this).parent().addClass('active');
			}, function() {
				$('.product__body').removeClass('active');
				$(this).parent().removeClass('active');
			});
			$(this).find('.zoom__body').bind('mousemove', function (event) {
				mx = event.pageX-$(this).offset().left;
				my = event.pageY-$(this).offset().top;

				r_x=tw-img.outerWidth();
				r_y=th-img.outerHeight();

				mx_p=mx/(tw+big.outerWidth()+r_x)*100;
				my_p=my/(th+big.outerHeight()+r_y)*100;

				b_x=0-big.find('img').outerWidth()/100*mx_p;
				b_y=0-big.find('img').outerHeight()/100*my_p;

				lens.css({
					top:my,
					left:mx
				});
				big.find('img').css({
					left:b_x,
					top:b_y
				});
			});
		});
	}
	$('.zoom').click(function(event) {
		return false;
	});
});