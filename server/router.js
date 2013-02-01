var email   = require('./email.js')
  , fs      = require('fs')
  , sha1    = require('sha1')
  , OpenTok = require('opentok')
  , github = require('octonode');

// config github
var auth_url = github.auth.config({
  id: '4f764f0fe8285250849d', // only for artichoke test
  secret: 'feab45be8f01be40e2e59282cdbf1ae16c3d127d'
}).login(['user', 'repo', 'gist']);

// login to github
exports.login = function(req, res) {
  res.redirect(301, auth_url + "&redirect_uri=http://localhost:3000/auth/" + req.params.id);
};

// auth page
exports.auth = function(req, res) {
  github.auth.login(req.query.code, function (err, token) {
    console.log("got the token:",token);
    res.cookie('gh', token, { signed: true }); // set expires
    res.redirect(301, "/edit/" + req.params.id);
  });
};

// room page
exports.email = function(req, res){
  email.send(req.body, 'template.jade', function(data) {
    res.send(data);
  });
};

// room page
exports.edit = function(req, res){

  var client = github.client(req.signedCookies.gh);
  // check for token validity! *** 
  console.log(client)
  client.me().repos(function(err, repos) {
    if(err) { 
      console.log(err);
      res.redirect(301, "login/"+req.params.id);
    }
    for(i in repos)
      console.log(repos[i].full_name)

    res.render('index');
  })

  /*client.get('/user', function (err, status, body) {
    console.log(body); //json object
  });

  client.repo('ottosipe/artichoke').info(function(err, repo) {
    console.log(repo)
  })*/


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