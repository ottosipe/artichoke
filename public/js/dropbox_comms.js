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

  /*client.mkdir('/fun', function(error, stat) {
        console.log('app.js stat');
        console.log(stat);
  });*/

  // ---------------------------------------------------------- //
  // Utility Functions that need access to 'client' obj
  // ---------------------------------------------------------- //

  now.dropboxSaveFile = function( filename, data ) {
    console.log('filename');
    console.log(filename);
    console.log(data);
    client.writeFile(filename, data, function(error, stat) {
        console.log('app.js stat');
        console.log(stat);
    });
  }

  now.dropboxOpenFile = function( filename ) {
    console.log('dropboxOpenFile()');
    console.log(filename);
    client.findByName('', filename, { "httpCache": "true" }, function(e, files) {
      console.log(files[0]);
      console.log(files.length);
      if(files.length > 0 && files[0].isFile == true) {
        client.readFile(files[0].path, { "httpCache": "true"}, function(e, filedata) {
          console.log(e)
          console.log(filedata);
          now.overwriteEditor(filedata);
        });
      } else {
        now.dropboxSaveFile(filename, '');
      }
    });
  }

  // ---------------------------------------------------------- //
  // ---------------------------------------------------------- //

  client.readdir("/", function(error, entries) {
    if (error) {} // Throw a Dialog Box

    now.readNewExpressApp();

    // Create an Express App if the directory is empty
    if(entries.length == 0) {
      /*client.writeFile('app.js', 'var app = express();', function(error, stat) {
        console.log('app.js stat');
        console.log(stat);
      });

      client.readdir("/", function(error, entries) {
        if (error) {} // Throw a Dialog Box
        window.files = entries;
        console.log("Your Dropbox contains " + entries.join(", "));
      });*/

    } else {
      window.files = entries;
      console.log("Your Dropbox contains " + entries.join(", "));
    }

    window.activeFile = 'untitled';
  });

  now.dataXfer = function( filename, data, isFile) {
    //console.log('*****************************');
    console.log(filename);
    if(isFile) {
      
    }
    /*client.writeFile(filename, data, function(error, stat) {
      console.log('app.js stat');
      console.log(stat);
    });*/
  }

  // ---------------------------------------------------------- //
  // ---------------------------------------------------------- //
});