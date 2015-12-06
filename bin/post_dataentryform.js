#!/usr/bin/env node
const fs = require('fs');
const urllib = require('urllib');
const conf = require('./configManager.js');

const app = {};

app.postDataEntryForm = function() {
  var url = conf.getConf().api.baseUrl + '/dataSets/' + conf.getArgs().dataset + '/customDataEntryForm';

  fs.readFile(conf.getArgs().file, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }

    var options = conf.getOptions().post;
    options.data = data;

    console.log(data);

    var resp = urllib.request(url, options).then(function(result) {
      console.log(result);
    });
  });
}

app.run = function() {
  if (!conf.isArg('dataset') || !conf.isArg('file')) {
    console.log('Usage: node post_dataentryform --dataset <datasetuid> --file <custom-form-file>');
    return;
  }

  app.postDataEntryForm();
}

app.run();
