#!/usr/bin/env node
const conf = require('./configManager.js');
const app = {};

app.run = function() {
  if (!conf.isArg('dataset') || !conf.isArg('file')) {
    return console.log('Usage: node post_dataentryform --dataset <datasetuid> --file <custom-form-file>');
  }

  var url = conf.getConf().api.baseUrl + '/dataSets/' + conf.getArgs().dataset + '/customDataEntryForm';
  conf.postFile(url, conf.getArgs().file, 'text/html');
}

app.run();
