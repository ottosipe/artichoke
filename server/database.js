var MongoDB = require('mongodb')
  , secret  = require('./secret.js');

var API = module.exports = exports;

(function(mongo) {
  var Server   = mongo.Server(secret.db.url, secret.db.port)
    , Database = mongo.Db(secret.db.name, Server, {safe: false});

  API.connect = function initMongoDB(cb) {
    console.log('Starting DB Connection');
    Database.open(function(err, db) {
      if(err) { return cb(err); }
      Database.authenticate(secret.db.user, secret.db.pass, cb);
      API.db = Database;
    });
  };
})(MongoDB);