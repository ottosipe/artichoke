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
	everyone.now.syncPeers = function( hash, newClientId, connectFlag, cb ){
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
	everyone.now.syncCursors = function( loc, clientId, hash ){
		if(this.user.clientId != clientId) {
			this.now.updateCursor(loc, hash);
		}
	};

	everyone.now.pushCursor = function( loc, hash ){
		//checkSession(hash, this.user.clientId);
		everyone.now.syncCursors(loc, this.user.clientId);
	};

	// Sync Text
	everyone.now.syncText = function( textData, clientId, hash ){
		if(this.user.clientId != clientId) {
			this.now.updateText(textData, hash);
		}
	};

	everyone.now.pushText = function( textData, hash ){
		//checkSession(hash, this.user.clientId);
		everyone.now.syncText(textData, this.user.clientId, hash );
	};

	var sessions = {}
	everyone.now.newUser = function( hash ) {
		var id = this.user.clientId;
		if(sessions[hash] == undefined) {
			console.log("new room, new user")
			sessions[hash] = {
				users: [id],
				master: id,
				tokboxToken: ""
			}
		} else {
			console.log("same room, new user")
			sessions[hash].users.push(id);
		}
		
		console.log(sessions);
	}


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
	// Dropbox Piping
	// ---------------------------------------------------------- //

	everyone.now.readNewExpressApp = function() {
		// console.log('cray');
		// var rootdir = './public/sample_app/';
		// fs.readdir(rootdir, function(err, files) {
  //       	console.log(files);
  //       	for(i in files) {
  //       		var stats = fs.lstatSync(rootdir+files[i]);
  //       		if(stats.isFile()) {
		// 			fs.readFile(rootdir+files[i], 'utf-8', function(err, data) {
		// 				console.log('$$$$$$$$$$$$');
	 //        			console.log(data);
	 //        		});
  //   			} else if(stats.isDirectory()) {
		// 			fs.readdir(rootdir, function(err, nested_files) {
		// 				for(j in nested_files) {
		// 					console.log('new dir -', rootdir, '+', files[i], '+ / +', nested_files[j]);
		// 					var nstats = fs.lstatSync(rootdir+files[i]+'/'+nested_files[j]);
		//         			/*if(nstats.isFile()) {
		// 						fs.readFile(rootdir+files[i]+'/'+nested_files[j], 'utf-8', function(nerr, ndata) {
		// 		        			console.log(ndata);
		// 		        		});
		// 		        	}*/
		// 			    }
		// 			});
  //   			}
  //       	}
  //     });
	}

}
