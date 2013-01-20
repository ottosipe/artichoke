$(function(){ 
  // ---------------------------------------------------------- //
  // Dropbox Interface with Host User
  // ---------------------------------------------------------- //

  var client = new Dropbox.Client({
    key: "0cYNdp0TWTA=|hn+SflkP/HQsDzXT6c9Fl7GLhbeo1ovUMiiIr3lHbQ==", sandbox: true
  });
  client.authDriver(new Dropbox.Drivers.Redirect({rememberUser: true}));

  // Error Handling Logging
  client.onError.addListener(function(error) {
      console.error(error);
  });

  client.authenticate(function(error, client) {
      if (error) {} // Throw a Dialog Box
      console.log("Auth'd with Dropbox!");
  });

  client.getUserInfo(function(error, userInfo) {
    console.log(userInfo);
  });

  console.log('**client**');
  console.log(client);

  // ---------------------------------------------------------- //
  // Utility Functions that need access to 'client' obj
  // ---------------------------------------------------------- //

  now.dropboxSaveFile = function( filename, data ) {
    client.writeFile(filename, data, function(error, stat) {
        console.log(stat);
    });
  }

  now.dropboxOpenFile = function( filename ) {
    client.findByName('', filename, { "httpCache": "true" }, function(e, files) {
      if(files.length > 0 && files[0].isFile == true) {
        window.activeFilePath = files[0].path;
        client.readFile(files[0].path, { "httpCache": "true"}, function(e, filedata) {
          now.overwriteEditor(filedata);
        });
      } else {
        now.dropboxSaveFile(filename, '');
      }
      $('#filepath').text(window.activeFilePath);
    });
  }

  now.dropboxDeleteFile = function( path ) {
    client.remove(path, function(a, b){
      console.log(a);
      console.log(b);
    });
  }

  // ---------------------------------------------------------- //
  // ---------------------------------------------------------- //

  client.readdir("/", function(error, entries) {
    if (error) {} // Throw a Dialog Box

    // Create an Express App if the directory is empty
    if(entries.length == 0) {
      now.readNewExpressApp();

      client.readdir("/", function(error, entries) {
        if (error) {} // Throw a Dialog Box
        window.files = entries;
        console.log("Your Dropbox contains " + entries.join(", "));
      });

    } else {
      window.files = entries;
      console.log("Your Dropbox contains " + entries.join(", "));
    }

    window.activeFile = 'README';
    window.activeFilePath = '/README'
  });

  // ---------------------------------------------------------- //
  // ---------------------------------------------------------- //

  /*client.mkdir('/fun', function(error, stat) {
        console.log('app.js stat');
        console.log(stat);
  });*/
  
});