var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var bookshelf = require('../config/bookshelf');
var ModelBase = require('bookshelf-modelbase')(bookshelf);

module.exports = (function() {
  return bookshelf.model('User', ModelBase.extend({
    tableName: 'users',
    location: function() {
      return this.belongsTo('Location');
    },
    regimes: function() {
      return this.hasMany('Regime');
    },
    friends: function() {
      return this.hasMany('Friend');
    },
    supplements: function() {
      return this.hasMany('Supplement');
    },
    feedItems: function() {
      return this.hasMany('FeedItem');
    },
    profileImages: function() {
      return this.hasMany('ProfileImage');
    },
    progressReports: function() {
      return this.hasMany('ProgressReport');
    },
    goals: function() {
      return this.hasMany('Goal');
    },

    initialize: function() {
      this.on('saving', this.hashPassword, this);
    },

    hashPassword: function(model, attrs, options) {
      var password = options.patch ? attrs.password : model.get('password');
      if (!password) { return; }
      return new Promise(function(resolve, reject) {
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(password, salt, null, function(err, hash) {
            if (options.patch) {
              attrs.password = hash;
            }
            model.set('password', hash);
            resolve();
          });
        });
      });
    },

    comparePassword: function(password, done) {
      var model = this;
      bcrypt.compare(password, model.get('password'), function(err, isMatch) {
        done(err, isMatch);
      });
    },

    hidden: ['password', 'passwordResetToken', 'passwordResetExpires'],

    virtuals: {
      gravatar: function() {
        if (!this.get('email')) {
          return 'https://gravatar.com/avatar/?s=200&d=retro';
        }
        var md5 = crypto.createHash('md5').update(this.get('email')).digest('hex');
        return 'https://gravatar.com/avatar/' + md5 + '?s=200&d=retro';
      }
    }
  },
  {
    dependents: ['regimes', 'supplements', 'progressReports', 'goals']
  }));
})();