$('.btn').click(function(){
	var loc = "default";
	if($('#link_text').val()) {
		loc = $('#link_text').val();
	}
	window.location = '/auth/' + loc + '/';
});