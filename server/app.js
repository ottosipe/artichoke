
var express   = require('express')
  , app       = express()
  , colors    = require('colors')
  , router    = require('./router.js')
  , config    = require('./config.js')
  , http      = require('http')
  , sha1      = require('sha1')
  //, sync      = require('./sync.js')
  , share 	  = require('share').server;

// setup here
config(app);

// start the server
var httpApp = http.createServer(app).listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')).yellow);
});

share.attach(app, {db: {type: 'none'}});

// define API routes here
app.get('/',             router.splash);
app.get('/auth/:id',     router.auth  );
app.get('/edit/:hash',   router.edit  );
app.get('/:hash/tokbox', router.tokbox);

app.post('/create', router.create);
app.post('/email',  router.email );

app.get('/test',         router.test);