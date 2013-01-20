$(function(){

  // tokbox
  // Initialize API key, session, and token...
  // Think of a session as a room, and a token as the key to get in to the room
  // Sessions and tokens are generated on your server and passed down to the client
  var apiKey = "22586972";
  var sessionId = "2_MX4yMjU4Njk3Mn4xMjcuMC4wLjF-U3VuIEphbiAyMCAwMTo1NjoyNSBQU1QgMjAxM34wLjk3MjExNjF-";
  var token = "T1==cGFydG5lcl9pZD0yMjU4Njk3MiZzaWc9ZTM3YTlhOWVkZTUzY2Y4ZWJhMTliNzMwODIzNzFmOGMwMWQ5YjcxNjpzZXNzaW9uX2lkPTJfTVg0eU1qVTROamszTW40eE1qY3VNQzR3TGpGLVUzVnVJRXBoYmlBeU1DQXdNVG8xTmpveU5TQlFVMVFnTWpBeE0zNHdMamszTWpFeE5qRi0mY3JlYXRlX3RpbWU9MTM1ODY3NTgwOCZleHBpcmVfdGltZT0xMzYxMjY3ODA4JnJvbGU9cHVibGlzaGVyJm5vbmNlPTExMDI2OSZzZGtfdmVyc2lvbj10Yi1kYXNoYm9hcmQtamF2YXNjcmlwdC12MQ==";

  TB.setLogLevel(TB.DEBUG);

      var session = TB.initSession(sessionId);
      session.addEventListener('sessionConnected', sessionConnectedHandler);
      session.addEventListener('streamCreated', streamCreatedHandler);
      //
      $("#startVideo").click(function() {
        session.connect(apiKey, token);
        $(this).parent().hide();
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