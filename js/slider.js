$(function() {
				// Preload Function
				$.fn.preload = function(options) {
					var opts 	= $.extend({}, $.fn.preload.defaults, options);
					o			= $.meta ? $.extend({}, opts, this.data()) : opts;
					var c		= this.length,
						l		= 0;
					return this.each(function() {
						var $i	= $(this);
						$('<img/>').load(function(i){
							++l;
							if(l == c) o.onComplete();
						}).attr('src',$i.attr('src'));	
					});
				};
				$.fn.preload.defaults = {
					onComplete	: function(){return false;}
				};
				
				
				// the slider main function
				$('#tf_play').hide();				
				var $tf_bg				= $('#tf_bg'),
					$tf_bg_images		= $tf_bg.find('img'),
					$tf_bg_img			= $tf_bg_images.eq(0),
					$tf_thumbs			= $('#tf_thumbs'),
					total				= $tf_bg_images.length,
					current				= 0,
					$tf_next			= $('#tf_next'),
					$tf_prev			= $('#tf_prev'),
					$tf_loading			= $('#tf_loading');
				
				//preload the images				
				$tf_bg_images.preload({
					onComplete	: function(){
						$tf_loading.hide();
						init();
					}
				});
				
				//shows the first image and initializes events
				function init(){
					var dim	= getImageDim($tf_bg_img);
					//set the returned values and show the image
					$tf_bg_img.css({
						width	: dim.width,
						height	: dim.height,
						left	: dim.left,
						top		: dim.top
					}).fadeIn();
				
					//resizing the window resizes the $tf_bg_img
					$(window).bind('resize',function(){
						var dim	= getImageDim($tf_bg_img);
						$tf_bg_img.css({
							width	: dim.width,
							height	: dim.height,
							left	: dim.left,
							top		: dim.top
						});
					});
					
					//click the arrow down, scrolls down
					$tf_next.bind('click',function(){
						if($tf_bg_img.is(':animated'))
							return false;
							scroll('tb');
					});
					
					//click the arrow up, scrolls up
					$tf_prev.bind('click',function(){
						if($tf_bg_img.is(':animated'))
						return false;
						scroll('bt');
					});
				}
				
				//show next / prev image
				function scroll(dir){
					//if dir is "tb" (top -> bottom) increment current, 
					//else if "bt" decrement it
					current	= (dir == 'tb')?current + 1:current - 1;
					
					//we want a circular slideshow, 
					//so we need to check the limits of current
					if(current == total) current = 0;
					else if(current < 0) current = total - 1;
					
					//flip the thumb
					$tf_thumbs.flip({
						direction	: dir,
						color		: '#000000',
						speed		: 400,
						onBefore	: function(){
							//the new thumb is set here
							var content;							
							if ( current == total-1 )
							content ='<img src="' + $tf_bg_images.eq(0).attr('longdesc') + '" alt="Thumb' + (current+1) + '"/>';
							else
							content ='<img src="' + $tf_bg_images.eq(current+1).attr('longdesc') + '" alt="Thumb' + (current+1) + '"/>';							
							$tf_thumbs.html(content);
						}
					});

					//we get the next image
					var $tf_bg_img_next	= $tf_bg_images.eq(current),
						dim = getImageDim($tf_bg_img_next),
						top	= (dir == 'tb')?$(window).height() + 'px':-parseFloat(dim.height,10) + 'px';
							
					//set the returned values and show the next image	
					$tf_bg_img_next.css({
						width	: dim.width,
						height	: dim.height,
						left	: dim.left,
						top		: top
					}).show();
						
					//now slide it to the viewport
					$tf_bg_img_next.stop().animate({
						top : dim.top
					},1000);
						
					//we want the old image to slide in the same direction, out of the viewport
					var slideTo	= (dir == 'tb')?-$tf_bg_img.height() + 'px':$(window).height() + 'px';
					$tf_bg_img.stop().animate({
						top : slideTo
					},1000,function(){
						$(this).hide();
						$tf_bg_img	= $tf_bg_img_next;						
					});
				}
				
				//animate the image to fit in the viewport
				function resize($img){
					var w_w	= $(window).width(),
						w_h	= $(window).height(),
						i_w	= $img.width(),
						i_h	= $img.height(),
						r_i	= i_h / i_w,
						new_w,new_h;
					
					if(i_w > i_h){
						new_w	= w_w;
						new_h	= w_w * r_i;
						
						if(new_h > w_h){
							new_h	= w_h;
							new_w	= w_h / r_i;
						}
					}	
					else{
						new_h	= w_w * r_i;
						new_w	= w_w;
					}
					
					$img.animate({
						width	: new_w + 'px',
						height	: new_h + 'px',
						top		: '0px',
						left	: '0px'
					},350);
				}
				
				//get dimentions of the image, 
				//in order to make it full size and centered
				function getImageDim($img){
					var w_w	= $(window).width(),
						w_h	= $(window).height(),
						r_w	= w_h / w_w,
						i_w	= $img.width(),
						i_h	= $img.height(),
						r_i	= i_h / i_w,
						new_w,new_h,
						new_left,new_top;
					
					if(r_w > r_i){
						new_h	= w_h;
						new_w	= w_h / r_i;
					}
					else{
						new_h	= w_w * r_i;
						new_w	= w_w;
					}

					return {
						width	: new_w + 'px',
						height	: new_h + 'px',
						left	: (w_w - new_w) / 2 + 'px',
						top		: (w_h - new_h) / 2 + 'px'
					};
				}
				
				// autoplay function
				$autoplay_timer = 5000				
				$(function start_Int() {
					var timer = setInterval(slider_init, $autoplay_timer);
					function slider_init() {
						$('#tf_next').trigger('click');
					}
					
					$('#tf_pause').click(function() {
						clearInterval(timer);
						$('#tf_pause').hide();
						$('#tf_play').show();
					});
					
					$('#tf_play').click(function() {
						$('#tf_next').trigger('click');
						timer = setInterval(slider_init, $autoplay_timer);
						$('#tf_play').hide();
						$('#tf_pause').show();
					});
				});
			});