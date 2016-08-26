#!/usr/bin/env node
const urlsync = require('urllib-sync');
const conf = require('./configManager.js');

const app = {
  analyticsTableUrl: conf.getConf().dhis.baseurl + '/api/resourceTables/analytics'
}

app.generateAnalyticsTables = function() {
  var data = {
    skipResourceTables: !!('true' == conf.getArgs()['skip-resource-tables']),
    skipAggregate: !!('true' == conf.getArgs()['skip-aggregate']),
    skipEvents: !!('true' == conf.getArgs()['skip-events'])
  }

  var options = conf.getOptions().post;
  options.data = data;

  var resp = urlsync.request(app.analyticsTableUrl, options);

  if (200 == resp.status) {
    console.log('Analytics tables generation started!');
  }
  else {
    console.log('Analytics tables generation could not be initiated, HTTP status: ' + resp.status);
  }
}

app.generateAnalyticsTables();
