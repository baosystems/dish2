#!/usr/bin/env node
const urlsync = require('urllib-sync');
const conf = require('./configManager.js');

const app = {
  analyticsTableUrl: conf.getConf().api.baseUrl + '/resourceTables/analytics'
}

app.generateAnalyticsTables = function() {
  var resp = urlsync.request(app.analyticsTableUrl, conf.getOptions().post);

  if (200 == resp.status) {
    console.log('Analytics table generation could not be initiated');
  }
  else {
    console.log('Analytics table generation could not be initiated, HTTP status: ' + resp.status);
  }
}

app.generateAnalyticsTables();
