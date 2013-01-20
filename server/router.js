var email  = require("./email.js")
	, fs   = require('fs')
	, sha1 = require("sha1")
	, dbox = require('dbox');

// ---------------------------------------------------------- //
// Dropbox stuff
// ---------------------------------------------------------- //

// Step 1
var app = dbox.app({ "app_key": "m1l60m7fimqc5is", "app_secret": "qls8i8mzdrl9652" });

// Step 2
var server_tok;
app.requesttoken(function(status, request_token){
	console.log('requesttoken...');
	console.log(request_token);
	// send the url to client
  	server_tok = request_token.authorize_url;
  	console.log('server_tok');
  	console.log(server_tok);
});

/*app.accesstoken(server_tok, function(status, access_token){
  console.log(access_token);
});*/

// Step 3
//var client = app.client(access_token);

// ---------------------------------------------------------- //
// ---------------------------------------------------------- //

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
		// Determine if the sandbox exists
		fs.readdir(_servers, function(err, dir){
			if(err) throw err;
			for(var f in dir) {
				console.log(dir[f]);
				if(dir[f][0] == '.') {
					continue;
				} else if(dir[f] == req.body.url) {
					found = true;
				}
			}

			// Create a new server sandbox
			if(!found) {
				fs.mkdir(_servers + req.body.url, function(err) {
					if (err) throw err;
					createExpressSandbox(_servers + req.body.url);
				});
			}
		});
	} else {
		var hash = sha1((new Date).getTime());
		var hash = hash.substr(0,6);
		sandbox_name = hash;
		fs.mkdir(_servers + hash, function(err) {
			if (err) throw err;
			createExpressSandbox(_servers + hash);
		});
	}

	// create tokbox token!!
	res.send(sandbox_name);
};

// Create the entire directory for the user when they create a new sandbox
function createExpressSandbox( filepath ){
	fs.writeFile(filepath + "/app.js", "console.log('hello node!');");
}


// room page
exports.edit = function(req, res){

	fs.readFile(_servers+req.params.hash+"/app.js", function(err, data) {
		if (err) {
			res.send(err);
		} else {
			res.render('index', { title: 'Artichoke', file: data, name: "/app.js"}); // make these post reqs.
		}
	})	
};

exports.save = function(req, res){
	//console.log(req.body.doc)
	fs.writeFile(_servers + req.params.hash + "/app.js", req.body.doc ,function() {
		res.send("saved")
		
	});
};

// main page
exports.splash = function(req, res){
	res.render('splash', { title: 'Artichoke' });
};
