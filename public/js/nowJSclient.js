window.users = [];

now.updateUserList = function( clientList ){
	console.log('new client joined');

	// Do other stuff when a new client joins
	window.users = clientList;
	console.log(window.users);
}

now.core.on('disconnect', function(){
	console.log('Client disconnected.');
});