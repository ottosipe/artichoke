var nodemailer = require('nodemailer')
  , secret     = require(__dirname + '/secret.js')
  , fs         = require('fs')
  , jade       = require('jade');

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", {
  service: "SendGrid",
  auth: secret.email // {user,pass}
});

exports.send = function sendMail(user, temp, cb) {
  // send mail with defined transport object
  if(user == null) return;
  var template = jade.compile(fs.readFileSync(__dirname+'/email/' + temp, 'utf8'));
  var html = template({
    name: user.name,
    email: user.email,
    hash: user.hash
  });

  var opts = {
    from: "Artichoke <do-not-reply@artichokedit.com>", // sender address
    to: user.name+" <"+user.email+">", // list of receivers
    subject: "Testing...", // Subject line
    html: html, // html body
    generateTextFromHTML: true
  }
  console.log(opts);

  // send the email
  smtpTransport.sendMail(opts, function(error, response){
    if(error){
      cb(error);
    } else {
      var msg = "Message sent: " + response.message;
      cb(msg);
    }
  });
};
