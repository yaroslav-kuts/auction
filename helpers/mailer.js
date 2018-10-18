const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'zndtestdev@gmail.com',
          pass: 'powdev27' }
});

const send = function (email) {
  transport.sendMail(email, function(err, info){
    if (err) console.log(err);
    console.log(`Confirmation email was sent to ${email.to}`);
  });
};

exports.send = send;
