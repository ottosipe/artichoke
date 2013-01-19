var mongo = require("./database.js"),
	email = require("./email.js"),
	fs 	  = require('fs'),
	sha1  = require("sha1");

mongo.connect(function(msg) {
	if(msg == null)
		console.log("Mongo Connected!");
	else 
		console.log(msg);
});

// main page
exports.splash = function(req, res){
	res.render('splash', { title: 'Artichoke' });
};

// room page
exports.index = function(req, res){
	res.render('index', { title: 'Artichoke', file: fs.readFileSync(__dirname+"/../public/servers/app.js")});
};

// throw user into a random room
exports.go = function(req, res){
	var hash = sha1((new Date).getTime());
	res.send(hash);
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