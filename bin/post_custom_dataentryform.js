#!/usr/bin/env node
const fs = require('fs');
const urllib = require('urllib');
const conf = require('./configManager.js');

const app = {};

/**
* Uploads data entry form read from a file for a specific data set.
*/
app.postDataEntryForm = function() {
  var url = conf.getConf().api.baseUrl + '/dataSets/' + conf.getArgs().dataset + '/customDataEntryForm';
  var file = conf.getArgs().file;
  conf.postFile(url, file, 'text/html');
}

/**
* Runs command.
*/
app.run = function() {
  if (!conf.isArg('dataset') || !conf.isArg('file')) {
    return console.log('Usage: node post_dataentryform --dataset <datasetuid> --file <custom-form-file>');
  }

  app.postDataEntryForm();
}

app.run();
