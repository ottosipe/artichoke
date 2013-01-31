$('#start').submit(function(e){

	github = {
		client_id: "4f764f0fe8285250849d" // localhost:3001
	}

	e.preventDefault();
	var doc = '';
	if($('#doc').val()) {
		doc = $('#doc').val();

		// check if namespace is available!

		var link = "https://github.com/login/oauth/authorize?client_id="
		+github.client_id 
		+"&redirect_uri=" 
		+ window.location.origin
		+ "/edit/" + doc;

		window.location = link;
	} else {
		$(this).animate({marginRight:"60px"}, 60, function() {
			$(this).animate({marginRight:"0px", marginLeft:"60px"}, 60, function() {
				$(this).animate({marginLeft:"0px"}, 60);
			});
		})
	}  

});