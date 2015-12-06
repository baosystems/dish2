#!/usr/bin/env node
const urlsync = require('urllib-sync');
const conf = require('./configManager.js');

const app = {
  resourceTableUrl: conf.getConf().api.baseUrl + '/resourceTables'
}

app.generateResourceTables = function() {
  var resp = urlsync.request(app.resourceTableUrl, conf.getOptions().post);

  if (200 == resp.status) {
    console.log('Resource table generation process started!');
  }
  else {
    console.log('Resource table generation could not be initiated, HTTP status: ' + resp.status);
  }
}

app.generateResourceTables();
