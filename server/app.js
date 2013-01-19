
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
  console.log(("Express server listening on port " + app.get('port')).blue);
});

// Create a local memory space for further now-configuration.
(function(){

	// Now that we have our HTTP server initialized, let's configure
	// our NowJS connector.
	var nowjs = require( "now" );
	var everyone = nowjs.initialize( httpApp );
	console.log('nowJS initialized');

	// Create the JSON object to store all user data
	var data = { "users": [] }

	///////////////

	everyone.now.syncPeers = function( cb ){
		console.log('syncPeers() fired with', data.users.length, 'users already here.');
		data.users.push(this.user.clientId);
		console.log('callingback, there are now', data.users.length, 'users');
		cb(data);
	};

	///////////////

	nowjs.on('connect', function(){
		console.log('CONNECTION IP');
		//console.log(nowjs.server.sockets);
		console.log(this.user.socket);
		/*console.log('client #', this.user.clientId, 'connected.');
		//console.log('There are', window.users.length, 'connected.');

		console.log(data);
		data.users.push( { "name": this.user.clientId } );
		console.log(data);
		everyone.now.pushUpdate( this.user.clientId );*/
	});

	nowjs.on('disconnect', function() {
		console.log(data);
		findAndRemove(data.users, 'name', this.user.clientId);
		console.log(data);
		//everyone.now.pushUpdate( this.user.clientId );
	});




	// Remove a user
	function findAndRemove(array, property, value) {
	   for (var index in array) {
	      if(array[property] == value) {
	          //Remove from array
	          array.splice(index, 1);
	      }    
	   }
	}

	 

	///////////////////////////////////////	 
	/*
	// Create primary key to keep track of all the clients that
	// connect. Each one will be assigned a unique ID.
	var primaryKey = 0;
	 
	 
	// When a client has connected, assign it a UUID. In the
	// context of this callback, "this" refers to the specific client
	// that is communicating with the server.
	//
	// NOTE: This "uuid" value is NOT synced to the client; however,
	// when the client connects to the server, this UUID will be
	// available in the calling context.
	everyone.connected(
		function(){
			this.now.uuid = ++primaryKey;
		}
	);

	*//////////////////////////////////////
	 

	}
)();