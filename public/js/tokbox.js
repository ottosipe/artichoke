$(function(){

  // tokbox
  // Initialize API key, session, and token...
  // Think of a session as a room, and a token as the key to get in to the room
  // Sessions and tokens are generated on your server and passed down to the client
  var apiKey = "22586972";
  var sessionId = "1_MX4yMjU4Njk3Mn4xMjcuMC4wLjF-RnJpIEphbiAxOCAxOToxOToxMSBQU1QgMjAxM34wLjA3MjA1MTA1fg";
  var token = "T1==cGFydG5lcl9pZD0yMjU4Njk3MiZzaWc9MmE4MTZmMDk4MmZiODI2ODY0NTg0OGRjYjNmNjU2MDY4NWZhZmM0NDpzZXNzaW9uX2lkPXVuZGVmaW5lZCZjcmVhdGVfdGltZT0xMzU4NTY1NTU3JmV4cGlyZV90aW1lPTEzNTg2NTE5NTcmcm9sZT1wdWJsaXNoZXImbm9uY2U9NDAwMDQ4JnNka192ZXJzaW9uPXRiLWRhc2hib2FyZC1qYXZhc2NyaXB0LXYx";

  // Initialize session, set up event listeners, and connect
  var session = TB.initSession(sessionId);
  session.addEventListener('sessionConnected', sessionConnectedHandler);
  //session.connect(apiKey, token);

  function sessionConnectedHandler(event) {
    var publisher = TB.initPublisher(apiKey, 'tokbox');
    session.publish(publisher);
  }

  function exceptionHandler(event) {
    // Retry session connect
    if (event.code === 1006 || event.code === 1008 || event.code === 1014) {
    alert('There was an error connecting. Trying again.');
    session.connect(apiKey, token);
    }
  }
  
});