
var express   = require('express')
  , app       = express()
  , colors    = require('colors')
  , router    = require('./router.js')
  , config    = require('./config.js')
  , http      = require('http')
  , Dropbox   = require('dropbox')
  , sha1      = require('sha1')
  , sync  = require('./sync.js');

// setup here
config(app);

// start the server
var httpApp = http.createServer(app).listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')).yellow);
});

sync(httpApp);



// define API routes here
app.get('/', router.splash);
app.get('/edit/:hash', router.edit);


app.post('/create', router.create);
//app.post('/edit/:hash/save', router.save);

app.get('/auth/:id', router.auth);
