$('.btn').click(function(){
	$.post('/create', function(data){
		console.log($('#link_text').val());
		if($('#link_text').val()) {
			console.log($('#link_text').val());
			window.location = "/edit/"+$('#link_text').val();
		} else {
			console.log(data);
			window.location = "/edit/"+data;
		}
	});
});