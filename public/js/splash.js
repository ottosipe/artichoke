$('#start').submit(function(e){
  e.preventDefault();
  var loc = 'default';
  if($('#hash').val()) {
  	loc = $('#hash').val();
  }
  // check if namespace is avail!
  window.location = '/edit/#' + loc; //bypass auth right now
});