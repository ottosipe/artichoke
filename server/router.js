var email   = require('./email.js')
  , fs      = require('fs')
  , sha1    = require('sha1')
  , OpenTok = require('opentok')
  , github  = require('octonode');


exports.start = function(expApp) {
  app = expApp;
  // config github
  console.log(app.get("gh_auth"));
  auth_url = github.auth.config(app.get("gh_auth")).login(['user', 'repo', 'gist']);
}

// login to github
exports.login = function(req, res) {
  var url = auth_url + "&redirect_uri="+app.get("host_url")+"/auth/" + req.params.id;
  console.log(req.origin)
  res.redirect(301, url);
};

// auth page
exports.auth = function(req, res) {
  console.log('code = ', req.query.code);
  github.auth.login(req.query.code, function (err, token) {
    if(err) throw err;
    console.log("got the token:",token);
    res.cookie('gh', token, { signed: true }); // set expires
    res.redirect(301, "/edit/" + req.params.id);
  });
};

// send email
exports.email = function(req, res){
  email.send(req.body, 'template.jade', function(data) {
    res.send(data);
  });
};

// room page
exports.edit = function(req, res){
  getReposAndRespond(req, res, "index");
};

// repos page
exports.repos = function(req, res){
  getReposAndRespond(req, res, "repos");
};

// redirect the user after github auth
function getReposAndRespond(req, res, jade_view){
  var client = github.client(req.signedCookies.gh);
  client.get('/user', function (err, status, body) {
    if(err) throw err;
    client.me().repos(function(err, repos) {
      if(err) { 
        console.log(err);
        res.redirect(301, "login/"+req.params.id);
      }
      body.repos = [];
      for(i in repos){
        body.repos[i] = repos[i].full_name;
      }
      if(jade_view === "repos") res.render(jade_view, { 'github' : body });
      else res.render(jade_view, { 'github' : JSON.stringify(body) });
    });
  });
};

// main page
exports.splash = function(req, res){
  res.render('splash', { title: 'Artichoke' });
};

var key     = '22586972';    // Replace with your API key  
var secret  = 'a535e3c85f85b25965171705fb78f35ec2a188af';  // Replace with your API secret  
var opentok = new OpenTok.OpenTokSDK(key, secret);
var tbSession = {};

exports.tokbox = function(req, res) {
  var hash = req.params.hash;
  console.log('hello,', hash);
  if (tbSession[hash] == undefined) {
    opentok.createSession('localhost', {'p2p.preference':'enabled'}, function(result){
      tbSession[hash] = result;
      var obj = {
        session: result,
        token: opentok.generateToken({session_id:result, role:OpenTok.RoleConstants.PUBLISHER, connection_data:"userId:42"})
      }
      console.log('new', obj);
      res.send(obj);
    });
  } else {
    var obj = {
      session: tbSession[hash],
      token: opentok.generateToken({session_id:tbSession[hash], role:OpenTok.RoleConstants.PUBLISHER, connection_data:"userId:42"})
    }
    console.log('same', obj);
    res.send(obj);	
  }
};