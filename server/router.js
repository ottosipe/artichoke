var email  = require("./email.js")
	, fs   = require('fs')
	, sha1 = require("sha1");

var _servers = __dirname+"/../public/servers/";	
var userServer;

// auth page
exports.auth = function(req, res) {
	console.log(req.params.id);
	res.render('auth.jade', { url:req.params.id , title: 'Artichoke' } );
};

// throw user into a new room
exports.create = function(req, res){
	console.log('FUNION!');
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
exports.edit = function(req, res){
	res.render('index', { title: 'Artichoke' });
};

// main page
exports.splash = function(req, res){
	res.render('splash', { title: 'Artichoke' });
};
