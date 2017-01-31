#!/usr/bin/env node
const conf = require('./configManager.js');
const app = {};

app.run = function() {
  if (!conf.isArg('dataset') || !conf.isArg('file')) {
    return console.log('Usage: post_dataentryform --dataset <datasetuid> --file <custom-form-file>');
  }

  var url = conf.getConf().dhis.baseurl + '/api/dataSets/' + conf.getArgs().dataset + '/customDataEntryForm';
  conf.postFile(url, conf.getArgs().file, 'text/html');
}

app.run();
