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

  client.readdir("/", function(error, entries) {
    if (error) {} // Throw a Dialog Box

    // Create an Express App if the directory is empty
    if(entries.length == 0) {

      client.writeFile('app.js', 'var app = express();', function(error, stat) {
        console.log('app.js stat');
        console.log(stat);
      });

      client.readdir("/", function(error, entries) {
        if (error) {} // Throw a Dialog Box
        window.files = entries;
        console.log("Your Dropbox contains " + entries.join(", "));
      });

    } else {
      window.files = entries;
      console.log("Your Dropbox contains " + entries.join(", "));
    }

    window.activeFile = 'untitled';
  });

  // ---------------------------------------------------------- //
  // ---------------------------------------------------------- //