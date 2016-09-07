#!/usr/bin/env node
const conf = require('./configManager.js');
const app = {};

app.run = function() {
  if (!conf.isArg('file')) {
    return console.log('Usage: node post_metadata --file <metadata-json>');
  }

  var url = conf.getConf().dhis.baseurl + '/api/metadata';
  var metadata = conf.getJsonFromFile(conf.getArgs().file);
  conf.postJson(url, metadata);
}

app.run();
