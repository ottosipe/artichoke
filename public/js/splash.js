$('.btn').click(function(){
	$.post('/create', function(data){
	  console.log(data);
	  window.location = "/edit/"+data;
	});
});