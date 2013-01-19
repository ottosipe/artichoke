now.pushUpdate = function( client_id ){
	console.log('client joined:', client_id);
}

window.users = [];

now.core.on('disconnect', function(){
	console.log('Client disconnected.');
});

now.core.on('connect', function(){
	console.log('Client connected.');

	now.ready(function(){
		now.syncPeers(function(e) {
			console.log('back into the client func');
			console.log(e);
			window.users.push(e);
			console.log(window.users);
		});
	});

});