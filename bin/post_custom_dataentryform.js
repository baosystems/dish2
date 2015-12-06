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
    options.headers = {
      'Content-Type': 'text/html'
    };

    urllib.request(url, options).then(function(result) {
      if (200 == result.status) {
        console.log('Form successfully uploaded: ' + conf.getArgs().dataset);
      }
      else {
        console.log('Form could not be uploaded, HTTP status code: ' + result.status);
      }
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
