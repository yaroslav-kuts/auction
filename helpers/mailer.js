const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
});

const send = function (email) {
  transport.sendMail(email, function(err){
    if (err) console.log(err);
  });
};

exports.send = send;
