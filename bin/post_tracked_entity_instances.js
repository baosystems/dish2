#!/usr/bin/env node
const csvtojson = require('csvtojson');
const fs = require('fs');
const urllib = require('urllib');
const conf = require('./configManager.js');

const app = {
  teisUrl: conf.getConf().api.baseUrl + '/trackedEntityInstances',
  filename: conf.getArgs().file
}

/**
* Post tracked entity instances.
*/
app.postTeis = function(teis) {
  var data = app.getTeis(teis);

  var options = conf.getOptions().post;
  options.data = data;
  options.headers = {
    'Content-Type': 'application/json'
  };

  urllib.request(app.teisUrl, options).then(function(result) {
    console.log(result);
  });
}

/**
* Returns an array of tracked entity instance objects.
*/
app.getTeis = function(teis) {
  var payload = {
    trackedEntityInstances: []
  }

  for (var i=0; i<teis.length; i++) {
    var tei = teis[i];
      obj = {},
      attrs = [];

    Object.keys(tei).forEach(function(key,inx) {

      if (!tei[key] || tei[key] == '') {
        return;
      }

      if ('trackedEntity' == key || 'orgUnit' == key) {
        obj[key] = tei[key];
      }
      else {
        var attr = {};
        attr['attribute'] = key;
        attr['value'] = tei[key];
        attrs.push(attr);
      }
    });

    obj.attributes = attrs;

    payload.trackedEntityInstances.push(obj);
  }

  return payload;
}

/**
* Runs command.
*/
app.run = function() {
  if (!conf.isArg('file')) {
    return console.log('Usage: node remove_tracked_entity_instances.js --file <name-of-tei-file>');
  }

  conf.convertCsvToJson(app.postTeis);
}

app.run();
