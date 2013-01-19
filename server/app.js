
var express   = require('express')
  , app       = express()
  , colors    = require('colors')
  , router    = require('./router.js')
  , config    = require('./config.js')
  , http      = require('http');

// setup here
config(app);


// define API routes here
app.get('/', router.index);
app.get('/email', router.email);
app.get('/db', router.db);
app.get('/admin', router.admin);


// start the server
var httpApp = http.createServer(app).listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')).yellow);
});

// Create a local memory space for further now-configuration.
(function(){
	var nowjs = require( "now" );
	var everyone = nowjs.initialize( httpApp );
	console.log('nowJS initialized');

	// Create the JSON object to store all user data
	var data = { "users": [] }


	// Sync User List
	everyone.now.syncPeers = function( newClientId, connectFlag, cb ){
		if(!connectFlag) {
			// Update all the peers on disconnect
			cb(data);
		} else if(newClientId === this.user.clientId) {
			if(connectFlag) {
				console.log('syncPeers() fired with', data.users.length, 'users already here.\t', this.user.clientId);
				data.users.push(this.user.clientId);
				console.log('callingback, there are now', data.users.length, 'users\t\t', this.user.clientId);
				cb(data);
			}
		}
	};

	// Sync Cursor
	everyone.now.syncCursors = function( loc, clientId ){
		if(this.user.clientId != clientId) {
			everyone.now.updateCursor(loc);
		}
	};

	everyone.now.pushCursor = function( loc ){
		everyone.now.syncCursors(loc, this.user.clientId);
	};

	// Sync Text

	nowjs.on('connect', function(){
		everyone.now.syncPeers(this.user.clientId, true, function(){
			everyone.now.updateUserList(data);
		});
	});

	nowjs.on('disconnect', function() {
		console.log('There were', data.users.length, 'here before disconnect.\t', this.user.clientId);
		findAndRemove(data.users, this.user.clientId);
		console.log('There are', data.users.length, 'here now.\t\t\t', this.user.clientId);

		everyone.now.syncPeers(this.user.clientId, false, function(){
			everyone.now.updateUserList(data);
		});
	});


	// Remove a user
	function findAndRemove(array, value) {
		for (var index in array) {
			/*console.log('index=', index);
			console.log('value=', value);
			console.log('array=', array);
			console.log('array[index]=', array[index]);*/
			if(array[index] == value) {
				//Remove 1 item from array starting at 'index'
				array.splice(index, 1);
			}
		}
	}

})();


