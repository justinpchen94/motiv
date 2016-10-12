var ControllerPrototype = require('../controller.prototype');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: process.env.MAILGUN_USERNAME,
    pass: process.env.MAILGUN_PASSWORD
  }
});

module.exports = (function() {
  var controller = ControllerPrototype.create({
    path: '/contact'
  });
  var router = controller.router;

  /**
   * POST /contact
   */
  router.post('/', function(req, res) {
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('message', 'Message cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    var errors = req.validationErrors();

    if (errors) {
      return res.status(400).send(errors);
    }

    var mailOptions = {
      from: req.body.name + ' ' + '<'+ req.body.email + '>',
      to: 'your@email.com',
      subject: '✔ Contact Form | Motiv',
      text: req.body.message
    };

    transporter.sendMail(mailOptions, function(err) {
      res.send({ msg: 'Thank you! Your feedback has been submitted.' });
    });
  });

  return controller;
})();
