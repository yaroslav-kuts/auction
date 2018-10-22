const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'zndtestdev@gmail.com',
    pass: 'powdev27'
  }
});

const send = function (email) {
  transport.sendMail(email, function(err){
    if (err) console.log(err);
  });
};

exports.send = send;
