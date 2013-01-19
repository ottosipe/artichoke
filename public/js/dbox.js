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

    // Strip out '/auth' from pathname
    var url_to_go = window.location.pathname.substr(5);
    console.log(url_to_go);

    $.post('/create', 
        { token:       client.oauth.token
        , tokenSecret: client.oauth.tokenSecreturl
        , uid:         client.uid
        , url:         url_to_go
        }, function(data){
      console.log(data);
      window.location = "/edit"+data;
    });
});


/*
cluster / spawn process
substack - bouncy
*/