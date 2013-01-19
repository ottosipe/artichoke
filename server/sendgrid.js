var email = require("nodemailer");
var sgusername = 'sendgrid_username';
var sgpassword = 'sendgrid_password';
email.send({
    host : "smtp.sendgrid.net",
    port : "587",
    domain : "yourdomain.com",
    to : "recipient@domain.com",
    from : "yourname@yourdomain.com",
    subject : "This is a subject",
    body: "Hello, this is a test body",
    authentication : "login",
    username : sgusername,
    password : sgpassword
  },
  function(err, result){
    if(err){
      console.log(err);
    }
});