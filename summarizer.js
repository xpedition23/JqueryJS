(function($) {
	var lastSentTime = new Date;
	var activeRequest = false;
	
	//same as $(document).ready();
	$(function() {
		$('#percentage').rangeinput({progress: true});
		$('#percentage').after('<p id="percent-label">%</p>');
		$('#percentage').change(getSummary);
		$('#text_in').change(getSummary);
		$('#submit-step').hide();
		$('#output-step h3').html('Step 3');
		$(document).ajaxStop(function() {
			activeRequest = false;
		});
	});

	function getSummary() {
		$.ajax( {
			type: 'POST',
			url: '/',
			data: {text_in: $('#text_in').val(),
					percentage: $('#percentage').val()},
			dataType: 'json',
			beforeSend: function() {
				if (activeRequest) {
					return false;
				}
				var currTime = new Date;
				if (currTime.getTime() - lastSentTime.getTime() < 1000) {
					return false;
				}
				activeRequest = true;
				lastSentTime = currTime;
			},
			success: function(json) {
				// clear previous error messages
				$('#text-error').html('');
				$('#percent-error').html('');
				// check for new errors
				if(json.errors) {
					if(!$('#js-globalerror').length) {
						$('#main').prepend('<div id="js-globalerror"><p class="error">An error occured</p></div>');
					}
					$('#js-globalerror').slideDown('slow').delay(800).slideUp('slow');
					if(json.errors.text_in) {
						$('#text-error').html(json.errors.text_in.join(' '));
					}
					if(json.errors.percentage) {
						$('#percent-error').html(json.errors.percentage.join(' '));
					}
				}
				// display output
				if(json.output) {
					$('#output').html(json.output);
				}
			}
		});
	};
	
})(jQuery);
