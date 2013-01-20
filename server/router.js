var email = require("./email.js"),
	fs 	  = require('fs'),
	sha1  = require("sha1");

var _servers = __dirname+"/../public/servers/";	
var userServer;

// admin page
exports.admin = function(req, res){
	res.send("<h3> You must be and admin! </h3>");
};

// auth page
exports.auth = function(req, res) {
	console.log(req.params.id);
	res.render('auth.jade', { url:req.params.id , title: 'Artichoke' } );
};

// throw user into a new room
exports.create = function(req, res){
	console.log('FUNION!');
	console.log(req.body);

	var found = false;
	if(req.body.url != undefined) {
		console.log('WE HAVE A LINK!');

		fs.readdir(_servers, function(err, dir){
			if(err) throw err;
			for(var f in dir) {
				console.log(dir[f]);
				if(dir[f][0] == '.') {
					continue;
				} else if(dir[f] == req.body.url) {
					console.log('FOUND!!');
					found = true;
					res.send(dir[f]);
				}
			}
		});
	}

	if(!found) {
		var hash = sha1((new Date).getTime());
		var hash = hash.substr(0,6);

		fs.mkdir(_servers + hash, function(err) {
			if (err) throw err
			fs.writeFile(_servers + hash + "/app.js", "console.log('hello node!');");
		
		});
		// create tokbox token!!
		res.send(hash);
	}
};

// db test
exports.db = function(req, res){
	mongo.db.collection("test", function(err, collection){
		collection.insert({ msg: "hello world" }, function(err, docs){
			if(err) throw err
			res.send(docs);
		});
	})
};

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

// email test
exports.email = function(req, res){
	email.send({ 
		name: "Otto", 
		email: "ottosipe@gmail.com"
	} 
	// templates defined in /server/email/
	,'template.jade', function(msg) { 
		console.log(msg);
		res.send(msg);
	});
};

// throw user into a random room
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