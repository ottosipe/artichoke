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
		everyone.now.syncCursors(loc, this.user.clientId);
	};

	// Sync Text
	everyone.now.syncText = function( textData, clientId, hash ){
		if(this.user.clientId != clientId) {
			this.now.updateText(textData, hash);
		}
	};

	everyone.now.pushText = function( textData, hash ){
		everyone.now.syncText(textData, this.user.clientId, hash );
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
	// Dropbox Piping
	// ---------------------------------------------------------- //

	everyone.now.readNewExpressApp = function() {
		console.log('cray');
		var rootdir = './public/sample_app';
		browse(rootdir);
		/*fs.readdir(rootdir, function(err, files) {
        	console.log(files);
        	for(i in files) {
        		(function(i){
	        		fs.lstat(rootdir+files[i], function(err, stats) {
		        		if(stats.isFile()) {
							/*fs.readFile(rootdir+files[i], 'utf-8', function(err, data) {
			        			console.log(data);
			        		});
		    			} else if(stats.isDirectory()) {
							fs.readdir(rootdir+files[i], function(err, nested_files) {
								for(j in nested_files) {
									(function(j){
										console.log('new dir -', rootdir, '+', files[i], '+ / +', nested_files[j]);
										fs.lstat(rootdir+files[i]+'/'+nested_files[j], function(err, nstats) {
						        			if(nstats.isFile()) {
												/*fs.readFile(rootdir+files[i]+'/'+nested_files[j], 'utf-8', function(nerr, ndata) {
								        			console.log(ndata);
								        		});


								        	} else if(stats.isDirectory()) {
												fs.readdir(rootdir+files[i]+'/'+nested_files[j], function(err, nested_files2) {
													for(k in nested_files2) {
														(function(k){
															console.log('new dir -', rootdir, '+', files[i], '+ / +', nested_files[j], '+ / +', nested_files2[k]);
															/*fs.lstat(rootdir+files[i]+'/'+nested_files[j], function(err, nstats) {
											        			/*if(nstats.isFile()) {
																	fs.readFile(rootdir+files[i]+'/'+nested_files[j], 'utf-8', function(nerr, ndata) {
													        			console.log(ndata);
													        		});
													        	}
													        //});
														})(k);
												    }
												});
							    			}




								        });
									})(j);
							    }
							});
		    			}
		    		});
				})(i);
        	}
      });*/
	}

	function browse(path) {
		console.log(path);
		fs.readdir(path, function(err, files) {
        	//console.log(files);
        	for(i in files) {
        		(function(i){
        			console.log(path,'/',files[i]);
        			fs.lstat(path+'/'+files[i], function(err, stats) {
		        		if(stats.isFile()) {
		        		} else if(stats.isDirectory()) {
		        			browse(path + '/' + files[i]);
		        		}
		        	});
        		})(i);
        	}
        });
	}

}
