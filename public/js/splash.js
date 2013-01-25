$('#start').submit(function(e){
	e.preventDefault();
	var loc = '#';
	if($('#hash').val()) {
		loc = "#"+$('#hash').val();

		// check if namespace is avail!
		window.location = '/edit/' + loc; //bypass auth right now
	} else {
		$(this).animate({marginRight:"60px"}, 60, function() {
			$(this).animate({marginRight:"0px", marginLeft:"60px"}, 60, function() {
				$(this).animate({marginLeft:"0px"}, 60);
			});
		})
	}  
});