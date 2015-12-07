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
  app.postFile(url, file, 'text/html');
}

/**
* Invokes a POST request.
* @param url the URL to post to.
* @param file the path to the file with the content to include as request payload.
* @param contentType the content type for the HTTP request.
*/
app.postFile = function(url, file, contentType) {
  fs.readFile(file, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }

    var options = conf.getOptions().post;
    options.data = data;
    options.headers = {
      'Content-Type': contentType
    };

    urllib.request(url, options).then(function(result) {
      if (200 == result.status || 201 == result.status) {
        console.log('Content successfully uploaded: ' + conf.getArgs().dataset);
      }
      else {
        console.log('Content could not be uploaded, HTTP status code: ' + result.status);
      }
    });
  });
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
