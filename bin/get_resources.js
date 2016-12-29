#!/usr/bin/env node
const conf = require('./configManager.js');
const urlsync = require('urllib-sync');
const fs = require('fs');

const app = {
};

app.logStats = function(requests) {
  var countMap = new conf.countMap(),
    totalTime = 0,
    totalData = 0;

  for (var i=0; i<requests.length; i++) {
    countMap.increment(requests[i].status);
    totalTime += requests[i].time;
    totalData += requests[i].data;
  }

  var entries = countMap.entries(),
    avgTime = totalTime / requests.length,
    avgData = totalData / requests.length;

  console.info('--- Summary ---');
  console.info('Number of requests: %d', requests.length);
  console.info('Total request time: %d ms', totalTime);
  console.info('Average request time: %d ms', avgTime);
  console.info('Total data length: %d ch', totalData);
  console.info('Average data length: %d ch', avgData);
  console.info('Status code summary (code/requests):');

  for (var i=0; i<entries.length; i++) {
    console.info('  %d: %d', entries[i].key, entries[i].val);
  }

  console.info();
}

app.getResources = function() {
  var requests = [],
    getOptions = conf.getOptions().get,
    resources = fs.readFileSync(conf.getArgs()['file']).toString().split('\n');

  console.info('Using file: %s', conf.getArgs()['file']);
  console.info('Resources: %d', resources.length);

  for (var i=0; i<resources.length; i++) {
    if (!resources[i]) {
      continue;
    }

    var url = conf.getConf().dhis.baseurl + resources[i];

    console.info('Request %d URL: %s', i, url);

    var start = new Date();
    var response = urlsync.request(url, getOptions);
    var end = new Date() - start;

    requests.push({
      'status': response.status,
      'time': end,
      'data': response.data.length
    });

    console.info('Response status: %d', response.status);
    console.info('Request time: %d ms', end)
    console.info('Data length: %d ch', response.data.length);
    console.info();
  }

  app.logStats(requests);
}

app.run = function() {
  if (!conf.isArg('file')) {
    return console.log('Usage: node get_resources --file <css-file>');
  }

  app.getResources();
}

app.run();
