$(document).ready(function() {

	// Tabs
	$(".tab_content").hide(); //Hide all content
	$("ul.tabs li:first").addClass("active").show(); //Activate first tab
	$(".tab_content:first").show(); //Show first tab content

	$("ul.tabs li").click(function() {

		$("ul.tabs li").removeClass("active"); //Remove any "active" class
		$(this).addClass("active"); //Add "active" class to selected tab
		$(".tab_content").hide(); //Hide all tab content

		var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
		$(activeTab).fadeIn(); //Fade in the active ID content
		return false;
	});


	// Toggle
	$(".toggle_container").hide(); 

	$(".toggle_trigger").click(function(){
		$(this).toggleClass("toggle_active").next().slideToggle("fast");
		return false;
	});
	
	
	// Contact Form
	$('#send_message').click(function(e){
		e.preventDefault();

		var error = false;
		var name = $('#name').val();
		var email = $('#email').val();
		var subject = $('#subject').val();
		var message = $('#message').val();
		var re = new RegExp(/^[a-z0-9_\-]+(\.[_a-z0-9\-]+)*@([_a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)$/);

		if(name.length == 0){
			var error = true;
			$('#name_error').fadeIn(500);
		}else{
			$('#name_error').fadeOut(500);
		}
		if(email.length == 0 || !email.match(re)) {
			var error = true;
			$('#email_error').fadeIn(500);
		}else{
			$('#email_error').fadeOut(500);
		}
		if(message.length == 0){
			var error = true;
			$('#message_error').fadeIn(500);
		}else{
			$('#message_error').fadeOut(500);
			}

		if(error == false){
			$('#send_message').attr({'disabled' : 'true', 'value' : 'Sending...' });
			/* using the jquery's post(ajax) function and a lifesaver
			function serialize() which gets all the data from the form
			we submit it to send_email.php */
			$.post("js/send_email.php", $("#contact_form").serialize(),function(result){
				if(result == 'sent'){
					$('#cf_submit_p').remove();
					$('#mail_success').fadeIn(500);
				}else{
					$('#mail_fail').fadeIn(500);
					$('#send_message').removeAttr('disabled').attr('value', 'Send The Message');
				}
			});
		}
	});
	
	// Image Effect
	$('img.image_effect').hover(function() {
		$(this).stop().animate({"opacity": 0.6}, 300);
	}, function () {
		$(this).stop().animate({"opacity": 1}, 300);
	});
	
	// Reverse Image Effect
	$('img.image_reverse').css({"opacity": 0.6})
	$('img.image_reverse').hover(function() {
		$(this).stop().animate({"opacity": 1}, 300);
	}, function () {
		$(this).stop().animate({"opacity": 0.6}, 300);
	});
	
	
	// Vertical Menu IE fix
	$(".sidebarmenu li").hover(function() {
		$(this).addClass("iehover");
	}, function() {
		$(this).removeClass("iehover");
	});
	
	
	// Start Tooltip
	$('[tooltip]').each(function()
	{
		$(this).qtip({
			content: $(this).attr('tooltip'),
			position: {
				corner: {
					target: 'bottomMiddle',
				},
				adjust: { y: 10 },
			},
			style: {
				border: {
					width: 1,
					radius: 3,
					color: '#ffffff'
				},
				width: { max: 250 },
				background: '#ffffff',
				name: 'light'
			}
		});
	});
});