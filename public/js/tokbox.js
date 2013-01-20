$(function(){

  // tokbox
  // Initialize API key, session, and token...
  // Think of a session as a room, and a token as the key to get in to the room
  // Sessions and tokens are generated on your server and passed down to the client

  //
    var apiKey = "22586972";
    TB.setLogLevel(TB.DEBUG);

    var session;

  $("#startVideo").click(function() {

    $.get("/"+window.sessionHash+'/tokbox', function(data) {

        console.log(data)
        session = TB.initSession(data.session);
        session.addEventListener('sessionConnected', sessionConnectedHandler);
        session.addEventListener('streamCreated', streamCreatedHandler);
        session.connect(apiKey, data.token);

        $(this).parent().hide();

    });
  
  });

  var publisher;
  function sessionConnectedHandler(event) {

    var params = {
      encodedHeight: 300,
      encodedWidth: 400,
      width:125,
      height:100
    }
    publisher = TB.initPublisher(apiKey, 'youtokbox', params);
    session.publish(publisher);

    // Subscribe to streams that were in the session when we connected
    subscribeToStreams(event.streams);
  }

  function streamCreatedHandler(event) {
    // Subscribe to any new streams that are created
    subscribeToStreams(event.streams);
  }

  function subscribeToStreams(streams) {
    for (var i = 0; i < streams.length; i++) {
      // Make sure we don't subscribe to ourself
      if (streams[i].connection.connectionId == session.connection.connectionId) {
        return;
      }

      // Create the div to put the subscriber element in to
      var div = document.createElement('div');
      div.setAttribute('id', 'stream' + streams[i].streamId);
      $("#tokboxes").append("<div class='tokbox'></div>");
      $("#tokboxes .tokbox:last").html(div)

      // Subscribe to the stream
      session.subscribe(streams[i], div.id);
    }
  }

});