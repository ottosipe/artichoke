$('.btn').click(function(){
	$.post('/go', function(data){
	  console.log(data);
	  window.location = data;
	});
});