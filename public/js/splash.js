$('#start').submit(function(e){

	github = {
		client_id: "4f764f0fe8285250849d" // localhost:3001
	}

	e.preventDefault();
	var doc = '';
	if($('#doc').val()) {
		doc = $('#doc').val();

		// check if namespace is available!
		window.location = "./login/"+doc;
	} else {
		$(this).animate({marginRight:"60px"}, 60, function() {
			$(this).animate({marginRight:"0px", marginLeft:"60px"}, 60, function() {
				$(this).animate({marginLeft:"0px"}, 60);
			});
		})
	}  

});