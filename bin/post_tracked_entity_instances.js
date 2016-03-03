#!/usr/bin/env node
const csvtojson = require('csvtojson');
const fs = require('fs');
const urllib = require('urllib');
const prettyjson = require('prettyjson');
const conf = require('./configManager.js');

const app = {
  teisUrl: conf.getConf().api.baseUrl + '/trackedEntityInstances'
}

/**
* Post tracked entity instances.
*/
app.postTeis = function(teis) {
  var data = app.getTeis(teis);

  if (conf.isArg('payload-file')) {
    fs.writeFile(conf.getArgs()['payload-file'], JSON.stringify(data));
  }

  var options = conf.getOptions().post;
  options.content = JSON.stringify(data);
  options.headers = {
    'Content-Type': 'application/json'
  };

  console.log('Uploading tracked entity instances..');

  urllib.request(app.teisUrl, options, function(err, data, result) {

    if (200 == result.status || 201 == result.status) {
      var resp = JSON.parse(data.toString('utf8'));

      console.log('Tracked entity instances successfully uploaded');

      if (conf.isArg('output-file')) {
        var outputFile = conf.getArgs()['output-file'],
            output = JSON.stringify(resp, null, 4);
        fs.writeFile(outputFile, output, 'utf8');
        console.log('Output written to: ' + outputFile);
      }
      else {
        console.log(prettyjson.render(resp));
      }
    }
    else {
      console.log('Tracked entity instances could not be uploaded');
      console.log('HTTP status code: ' + result.status);
      console.log('Error: ' + err);
      console.log('Response: ' + data.toString('utf8'));
    }
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
* Runs command. Accepts three input parameters:
* - file: CSV file to read.
* - output-file: (Optional) Write summary of import operation to a file with the given name.
* - payload-file: (Optional) Write payload to import to a file with the given name.
*/
app.run = function() {
  if (!conf.isArg('file')) {
    return console.log('Usage: node post_tracked_entity_instances --file <name-of-tei-file>');
  }

  console.log('Using file: ' + conf.getArgs()['file']);
  console.log('Parsing CSV file..');

  conf.convertCsvToJson(app.postTeis);
}

app.run();
