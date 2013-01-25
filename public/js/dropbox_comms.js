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
          console.log('overwriteEditor!');
          now.overwriteEditor(filedata);
        });
      } else {
        window.activeFilePath = filename;
        now.dropboxSaveFile(filename, '');
      }
    });
  }

  now.dropboxDeleteFile = function( path ) {
    console.log(path);
    client.remove(path, function(a, b){
      console.log(a);
      console.log(b);
    });
  }

  // ---------------------------------------------------------- //
  // ---------------------------------------------------------- //

  client.readdir("/", function(error, entries) {
    if (error) {} // Throw a Dialog Box
    window.activeFile     = 'README';
    window.activeFilePath = '/README'

    /*now.dropboxOpenFile('README', function(a, b){
        console.log(a);
        console.log(b);
    });*/
    window.files = entries;
    console.log("Your Dropbox contains " + entries.join(", "));
  });

  // ---------------------------------------------------------- //
  // ---------------------------------------------------------- //
  
});