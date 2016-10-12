var ControllerPrototype = require('../controller.prototype');
var User = require('../../models/User');
var authHelper = require('../../helpers/authHelper');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

module.exports = (function() {
  var controller = ControllerPrototype.create({
    path: '/login'
  });
  var router = controller.router;

  /**
   * POST /login
   * Sign in with email and password
   */
  router.post('/', function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    var errors = req.validationErrors();

    if (errors) {
      return res.status(400).send(errors);
    }

    new User({ email: req.body.email })
    .fetch()
    .then(function(user) {
      if (!user) {
        return res.status(401).send({ 
          msg: 'The email address ' 
            + req.body.email 
            + ' is not associated with any account. ' 
            + 'Double-check your email address and try again.'
        });
      }
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (!isMatch) {
          return res.status(401).send({ msg: 'Invalid email or password' });
        }
        res.send({ 
          token: authHelper.generateToken(user), 
          user: user.toJSON() 
        });
      });
    });
  });

  /**
   * POST /login/forgot
   */
  router.post('/forgot', function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    var errors = req.validationErrors();

    if (errors) {
      return res.status(400).send(errors);
    }

    async.waterfall([
      function(done) {
        crypto.randomBytes(16, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        new User({ email: req.body.email })
          .fetch()
          .then(function(user) {
            if (!user) {
          return res.status(400).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account.' });
            }
            user.set('passwordResetToken', token);
            user.set('passwordResetExpires', new Date(Date.now() + 3600000)); // expire in 1 hour
            user.save(user.changed, { patch: true }).then(function() {
              done(null, token, user.toJSON());
            });
          });
      },
      function(token, user, done) {
        var transporter = nodemailer.createTransport({
          service: 'Mailgun',
          auth: {
            user: process.env.MAILGUN_USERNAME,
            pass: process.env.MAILGUN_PASSWORD
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'support@yourdomain.com',
          subject: '✔ Reset your password on Motiv',
          text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        transporter.sendMail(mailOptions, function(err) {
          res.send({ msg: 'An email has been sent to ' + user.email + ' with further instructions.' });
          done(err);
        });
      }
    ]);
  });

  /**
  * POST /login/reset
  */
  router.post('/reset', function(req, res, next) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirm', 'Passwords must match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }

    async.waterfall([
      function(done) {
        new User({ passwordResetToken: req.params.token })
          .where('passwordResetExpires', '>', new Date())
          .fetch()
          .then(function(user) {
            if (!user) {
            return res.status(400).send({ msg: 'Password reset token is invalid or has expired.' });
            }
            user.set('password', req.body.password);
            user.set('passwordResetToken', null);
            user.set('passwordResetExpires', null);
            user.save(user.changed, { patch: true }).then(function() {
            done(err, user.toJSON());
            });
          });
      },
      function(user, done) {
        var transporter = nodemailer.createTransport({
          service: 'Mailgun',
          auth: {
            user: process.env.MAILGUN_USERNAME,
            pass: process.env.MAILGUN_PASSWORD
          }
        });
        var mailOptions = {
          from: 'support@yourdomain.com',
          to: user.email,
          subject: 'Your Motiv password has been changed',
          text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        transporter.sendMail(mailOptions, function(err) {
          res.send({ msg: 'Your password has been changed successfully.' });
        });
      }
    ]);
  });

  return controller;
})();