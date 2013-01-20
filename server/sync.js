var nowjs = require( "now" )
	, fs = require('fs');

// Create a local memory space for further now-configuration.
module.exports = function syncNowJS(httpApp){

	var everyone = nowjs.initialize( httpApp );

	// Create the JSON object to store all user data
	var data = { "users": [] };

	// ---------------------------------------------------------- //
	// Synchro Functions
	// ---------------------------------------------------------- //

	// Sync User List
	everyone.now.syncPeers = function( newClientId, connectFlag, cb ){
		if(!connectFlag) {
			// Update all the peers on disconnect
			cb(data);
		} else if(newClientId === this.user.clientId ) {
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
			this.now.updateCursor(loc);
		}
	};

	everyone.now.pushCursor = function( loc ){
		everyone.now.syncCursors(loc, this.user.clientId);
	};

	// Sync Text
	everyone.now.syncText = function( textData, clientId ){
		if(this.user.clientId != clientId) {
			this.now.updateText(textData);
		}
	};

	everyone.now.pushText = function( textData ){
		everyone.now.syncText(textData, this.user.clientId);
	};

	// ---------------------------------------------------------- //
	// ---------------------------------------------------------- //

	// Remove a user
	function findAndRemove(array, value) {
		for (var index in array) {
			if(array[index] == value) {
				array.splice(index, 1);
			}
		}
	}

	// ---------------------------------------------------------- //
	// Event Handling
	// ---------------------------------------------------------- //

	nowjs.on('connect', function(){
		everyone.now.syncPeers(this.user.clientId, true, function(){
			everyone.now.updateUserList(data);
		});
	});

	nowjs.on('disconnect', function() {
		everyone.now.removeZombieCursor(this.user.clientId);

		console.log('There were', data.users.length, 'here before disconnect.\t', this.user.clientId);
		findAndRemove(data.users, this.user.clientId);
		console.log('There are', data.users.length, 'here now.\t\t\t', this.user.clientId);

		everyone.now.syncPeers(this.user.clientId, false, function(){
			everyone.now.updateUserList(data);
		});
	});

	// ---------------------------------------------------------- //
	// Dropbox Pipiing
	// ---------------------------------------------------------- //

	everyone.now.readNewExpressApp = function() {
		console.log('cray');
		fs.readdir('./public/sample_app/', function(err, files) {
        	console.log(files);
      });
	}

}
