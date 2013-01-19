// ---------------------------------------------------------- //
// Dropbox stuff
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
    if (error) {
      console.log('DIDNT WORK', error);
      return showError(error);
    }
    console.log("Auth'd with Dropbox!");


    console.log(client.oauth.token);
    console.log(client.oauth.tokenSecret);
    console.log(client.uid);
    console.log('inside callback');

    //Send this user data to the server, then server can make calls on behalf of user
    //now.sendDropBoxToken(window.location.href);
});