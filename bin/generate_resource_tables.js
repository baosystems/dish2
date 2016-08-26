#!/usr/bin/env node
const urlsync = require('urllib-sync');
const conf = require('./configManager.js');

const app = {
  resourceTableUrl: conf.getConf().dhis.baseurl + '/api/resourceTables'
}

app.generateResourceTables = function() {
  var resp = urlsync.request(app.resourceTableUrl, conf.getOptions().post);

  if (200 == resp.status) {
    console.log('Resource tables generation started!');
  }
  else {
    console.log('Resource tables generation could not be initiated, HTTP status: ' + resp.status);
  }
}

app.generateResourceTables();
