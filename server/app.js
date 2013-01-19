
var express   = require('express')
  , app       = express()
  , colors    = require('colors')
  , router    = require('./router.js')
  , config    = require('./config.js')
  , http      = require('http')
  , Dropbox   = require('dropbox')
  , sha1      = require('sha1');

// setup here
config(app);

// define API routes here
app.get('/', router.splash);
app.get('/edit/:hash', router.edit);


app.post('/create', router.create);
app.post('/edit/:hash/save', router.save);



app.get('/email', router.email);
app.get('/db', router.db);
app.get('/admin', router.admin);


app.get('*', function(req, res){
  res.send('Artichoke.js - That page is not here.', 404);
});


// ---------------------------------------------------------- //
// ---------------------------------------------------------- //

// start the server
var httpApp = http.createServer(app).listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')).yellow);
});

// ---------------------------------------------------------- //
// ---------------------------------------------------------- //


// Create a local memory space for further now-configuration.
(function(){
	var nowjs = require( "now" );
	var everyone = nowjs.initialize( httpApp );
	console.log('nowJS initialized');

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
	// Room Handling
	// ---------------------------------------------------------- //

	var rooms = [];


	// ---------------------------------------------------------- //
	// ---------------------------------------------------------- //
})();

