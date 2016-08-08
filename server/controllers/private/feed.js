var moment = require('moment');
var request = require('request');
var qs = require('querystring');

var ControllerPrototype = require('../controller.prototype');
var Regime = require('../../models/Regime');

module.exports = (function() {
  var controller = ControllerPrototype.create({
    path:'/api/feed'
  });
  var router = controller.router;

  router.get('/', function(req,res){
    var resObj = [
      {
        name: 'Justin',
        time: new Date(),
        content: 'this is some string'
      },
      {
        name: 'Sean',
        time: new Date(),
        content: 'oh herro'
      },
      {
        name: 'Denny',
        time: new Date(),
        content: 'hnnnnng'
      },
      {
        name: 'Justin',
        time: new Date(),
        content: 'this is some string'
      },
      {
        name: 'Sean',
        time: new Date(),
        content: 'oh herro'
      },
      {
        name: 'Denny',
        time: new Date(),
        content: 'hnnnnng'
      },
      {
        name: 'Justin',
        time: new Date(),
        content: 'this is some string2'
      },
      {
        name: 'Sean',
        time: new Date(),
        content: 'oh herro'
      },
      {
        name: 'Denny',
        time: new Date(),
        content: 'hnnnnng2345'
      }

    ]
    res.json(resObj);
  });

  return controller;
})()
