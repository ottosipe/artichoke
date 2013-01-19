// ---------------------------------------------------------- //
// Dropbox stuff
// ---------------------------------------------------------- //

// THIS NEEDS TO BE RE-IMAGINED

//module.exports = function(dropbox) {

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
      // Replace with a call to your own error-handling code.
      //
      // Don't forget to return from the callback, so you don't execute the code
      // that assumes everything went well.
      return showError(error);
    }

    // Replace with a call to your own application code.
    //
    // The user authorized your app, and everything went well.
    // client is a Dropbox.Client instance that you can use to make API calls.
    
    //doSomethingCool(client);
    console.log("Auth'd with Dropbox!");

    client.getUserInfo(function(error, userInfo) {
    	if (error) {
        return showError(error);  // Something went wrong.
    	}

    	alert("Hello, " + userInfo.name + "!");
    });
  });

//}