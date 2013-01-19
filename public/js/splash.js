$('.btn').click(function(){
	/*if($('#link_text').val()) {
		console.log($('#link_text').val());
		window.location = "/edit/"+$('#link_text').val();
	} else {
		$.post('/create', function(data){
			console.log(data);
			window.location = "/edit/"+data;
		});
	}*/

	window.location= '/auth';
});

// Get the homepage to go to a custom URL, must check that it doesn't exist