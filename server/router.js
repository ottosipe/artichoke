var email = require("./email.js"),
	fs 	  = require('fs'),
	sha1  = require("sha1");

	var _servers = __dirname+"/../public/servers/";
	
// main page
exports.splash = function(req, res){
	res.render('splash', { title: 'Artichoke' });
};

// room page
exports.edit = function(req, res){
	fs.readFile(_servers+req.params.hash+"/app.js", function(err, data) {
		if (err) {
			res.send(err);
		} else {
			res.render('index', { title: 'Artichoke', file: data, name: "/app.js"});
		}
	})	
};

// room page
exports.view = function(req, res){
	var server = require(_servers+req.params.hash+"/app.js");

	res.send("done");
};


// throw user into a new room
exports.create = function(req, res){
	if(arguments[2] !== undefined) {
		console.log(arguments[2]);
	}
	var hash = sha1((new Date).getTime());
	var hash = hash.substr(0,6);

	fs.mkdir(_servers + hash, function(err) {
		if (err) throw err
		fs.writeFile(_servers + hash + "/app.js", "console.log('hello node!');");
	});

	res.send(hash);
};

// throw user into a random room
exports.save = function(req, res){
	console.log(req.body.doc)
	fs.writeFile(_servers + req.params.hash + "/app.js", req.body.doc ,function() {
		res.send("saved")
	});
};

exports.auth = function(req, res) {
	console.log()
	res.render('auth.jade', { title: 'Artichoke' } );
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

// db test
exports.db = function(req, res){
	mongo.db.collection("test", function(err, collection){
		collection.insert({ msg: "hello world" }, function(err, docs){
			if(err) throw err
			res.send(docs);
		});
	})
};

// admin page
exports.admin = function(req, res){
	res.send("<h3> You must be and admin! </h3>");
};