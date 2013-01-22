var email   = require('./email.js')
  , fs      = require('fs')
  , sha1    = require('sha1')
  , OpenTok = require('opentok');

var _servers = __dirname + '/../public/servers/';
var userServer;

var hosts     = {};
var tbSession = {};

// auth page
exports.auth = function(req, res) {
	console.log(req.params.id);
	res.render('auth.jade', { url:req.params.id , title: 'Artichoke' });
};

// throw user into a new room
exports.create = function(req, res){
	console.log(req.body);

	var sandbox_name = "";

	if(req.body.url != undefined) {
		sandbox_name = req.body.url;
	} else {
		var hash = sha1((new Date).getTime());
		var hash = hash.substr(0,6);
		sandbox_name = hash;
	}

	// create tokbox token!!
	res.send(sandbox_name);
};

// room page
exports.email = function(req, res){
	email.send(req.body, 'template.jade', function(data) {
		res.send(data);
	});
};

// room page
exports.edit = function(req, res){
	res.render('index');
};


// main page
exports.splash = function(req, res){
	res.render('splash', { title: 'Artichoke' });
};

var key     = '22586972';    // Replace with your API key  
var secret  = 'a535e3c85f85b25965171705fb78f35ec2a188af';  // Replace with your API secret  
var opentok = new OpenTok.OpenTokSDK(key, secret);

exports.tokbox = function(req, res) {
	var hash = req.params.hash;
	console.log('hello,', hash)
	if (tbSession[hash] == undefined) {
		
		opentok.createSession("localhost", {'p2p.preference':'enabled'}, function(result){
		  tbSession[hash] = result;
		  var obj = {
		  	session: result,
		  	token: opentok.generateToken({session_id:result, role:OpenTok.RoleConstants.PUBLISHER, connection_data:"userId:42"})
		  }
		  console.log('new', obj)
		  res.send(obj)
		});

	} else {
		var obj = {
			session: tbSession[hash],
			token: opentok.generateToken({session_id:tbSession[hash], role:OpenTok.RoleConstants.PUBLISHER, connection_data:"userId:42"})
		}
		console.log('same', obj)
		res.send(obj);	
	}
};