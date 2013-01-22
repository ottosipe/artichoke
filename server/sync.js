var nowjs = require('now')
  , fs    = require('fs');

// Create a local memory space for further now-configuration.
module.exports = function syncNowJS(httpApp){
  // Create the JSON object to store all user data
  var data     = { "users": [] };
  var everyone = nowjs.initialize(httpApp);

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
  everyone.now.syncCursors = function( loc, clientId, hash ){
    if(this.user.clientId != clientId) {
      this.now.updateCursor(loc, hash);
    }
  };

  everyone.now.pushCursor = function( loc, hash ){
    //checkSession(hash, this.user.clientId);
    everyone.now.syncCursors(loc, this.user.clientId, hash);
  };

  // Sync Text
  everyone.now.syncText = function( textData, clientId, hash ){
    if(this.user.clientId != clientId) {
      this.now.updateText(textData, hash);
    }
  };

  everyone.now.pushText = function( textData, hash ){
    //checkSession(hash, this.user.clientId);
    everyone.now.syncText(textData, this.user.clientId, hash);
  };

  everyone.now.sendDoc = function( doc, hash , cb) {
    var textData = { 
      action: 'wholeDoc',
      doc: doc
    }
    console.log('sending doc', doc)
    everyone.now.syncText(textData, this.user.clientId, hash);
    cb(textData, hash, this.user.clientId);
  };

  var sessions = {}
  everyone.now.newUser = function( hash ) {
    var id = this.user.clientId;
    if(sessions[hash] == undefined) {
      console.log('new room, new user');
      sessions[hash] = {
        users: [id],
        master: id
      };
    } else {
      console.log('same room, new user');
      sessions[hash].users.push(id);
    }
    console.log(sessions);
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
    everyone.now.syncPeers(this.user.clientId, true, function(x){
      everyone.now.updateUserList(x);
    });
  });

  nowjs.on('disconnect', function(){
    everyone.now.removeZombieCursor(this.user.clientId);

    console.log('There were', data.users.length, 'here before disconnect.\t', this.user.clientId);
    findAndRemove(data.users, this.user.clientId);
    console.log('There are', data.users.length, 'here now.\t\t\t', this.user.clientId);

    everyone.now.syncPeers(this.user.clientId, false, function(x){
      everyone.now.updateUserList(x);
    });
  });

  // ---------------------------------------------------------- //
  // Dropbox Piping
  // ---------------------------------------------------------- //

  everyone.now.readNewExpressApp = function(){
    console.log('readNewExpressApp()');
    console.log(this.user.clientId);
    var rootdir = './public/sample_app';
    browse(rootdir);
  };

  function browse(path) {
    console.log(path);
    fs.readdir(path, function(err, files) {
      for(i in files) {
        (function(i){
          console.log(path,'/',files[i]);
          fs.lstat(path + '/' + files[i], function(err, stats) {
            if(stats.isFile()) {
              fs.readFile(path + '/' + files[i], 'utf-8', function(err, data) {
                everyone.now.dataXfer(files[i], data, true);
              });
            } else if(stats.isDirectory()) {
              everyone.now.dataXfer(files[i], data, false);
              browse(path + '/' + files[i]);
            }
          });
        })(i);
      }
    });
  }

}
