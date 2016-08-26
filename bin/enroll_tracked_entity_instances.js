#!/usr/bin/env node
const conf = require('./configManager.js');

const app = {
  postUrl: conf.getConf().dhis.baseurl + '/api/enrollments'
}

/**
* Enrolls tracked entity instances.
*/
app.enrollTeis = function(json) {
  var payload = {
    enrollments: json
  }

  conf.postJson(app.postUrl, payload);
}

/**
* Runs command. Accepts three input parameters:
* - file: CSV file to read.
* - output-file: (Optional) Write summary of import operation to a file with the given name.
* - payload-file: (Optional) Write payload to import to a file with the given name.
*/
app.run = function() {
  if (!conf.isArg('file')) {
    return console.log('Usage: node enroll_tracked_entity_instances --file <name-of-enrollment-file>');
  }

  console.log('Using file: ' + conf.getArgs()['file']);
  console.log('Parsing CSV file..');

  conf.convertCsvToJson(app.enrollTeis);
}

app.run();
