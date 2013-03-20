$('#start').submit(function(e){

	e.preventDefault();
	var doc = $('#doc').val().toLowerCase();
	var specialValues = ["git", "github", "repo", "repos"];

	if($.inArray(doc, specialValues) !== -1) {
		// take user to page to select which github repo
		window.location = "/repos";
	} else if(doc) {
		// check if namespace is available!
		window.location = "/login/"+doc;
	} else {
		// user didn't type anything in, shake the login box
		$(this).animate({marginRight:"60px"}, 60, function() {
			$(this).animate({marginRight:"0px", marginLeft:"60px"}, 60, function() {
				$(this).animate({marginLeft:"0px"}, 60);
			});
		});
	}

});