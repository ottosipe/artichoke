$(function(){

  // tokbox
  // Initialize API key, session, and token...
  // Think of a session as a room, and a token as the key to get in to the room
  // Sessions and tokens are generated on your server and passed down to the client
  var apiKey = "22586972";
  var sessionId = "1_MX4yMjU4Njk3Mn4xMjcuMC4wLjF-RnJpIEphbiAxOCAxOToxOToxMSBQU1QgMjAxM34wLjA3MjA1MTA1fg";
  var token = "T1==cGFydG5lcl9pZD0yMjU4Njk3MiZzaWc9MmE4MTZmMDk4MmZiODI2ODY0NTg0OGRjYjNmNjU2MDY4NWZhZmM0NDpzZXNzaW9uX2lkPXVuZGVmaW5lZCZjcmVhdGVfdGltZT0xMzU4NTY1NTU3JmV4cGlyZV90aW1lPTEzNTg2NTE5NTcmcm9sZT1wdWJsaXNoZXImbm9uY2U9NDAwMDQ4JnNka192ZXJzaW9uPXRiLWRhc2hib2FyZC1qYXZhc2NyaXB0LXYx";

  TB.setLogLevel(TB.DEBUG);

      var session = TB.initSession(sessionId);
      session.addEventListener('sessionConnected', sessionConnectedHandler);
      session.addEventListener('streamCreated', streamCreatedHandler);
      session.connect(apiKey, token);

      var publisher;

      function sessionConnectedHandler(event) {
        publisher = TB.initPublisher(apiKey, 'youtokbox');
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
          $(".tokbox").append(div);

          // Subscribe to the stream
          session.subscribe(streams[i], div.id);
        }
      }

});