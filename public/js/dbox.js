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

  // ---------------------------------------------------------- //
  // Strip out '/auth' from pathname
  // ---------------------------------------------------------- //
  var url_to_go = window.location.pathname.substr(window.location.pathname.indexOf('/') + 1, window.location.pathname.length - 1);
  url_to_go = url_to_go.substr(url_to_go.indexOf('/'), url_to_go.length - url_to_go.indexOf('/'));
  url_to_go = url_to_go.substr(url_to_go.indexOf('/') + 1, url_to_go.length - (url_to_go.indexOf('/') + 1))
  var length_of_loc = url_to_go.indexOf('/');
  url_to_go = url_to_go.substr(0, length_of_loc);
  // ---------------------------------------------------------- //
  // ---------------------------------------------------------- //

  $.post('/create', 
      { token:       client.oauth.token
      , tokenSecret: client.oauth.tokenSecreturl
      , uid:         client.uid
      , url:         url_to_go
      }, function(data){
    console.log(data);
    window.location = '/edit/' + data;
  });
});