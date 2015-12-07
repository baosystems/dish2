#!/usr/bin/env node
const conf = require('./configManager.js');
const app = {};

app.run = function() {
  if (!conf.isArg('file')) {
    return console.log('Usage: node post_js --file <js-file>');
  }

  var url = conf.getConf().api.baseUrl + '/files/script';
  conf.postFile(url, conf.getArgs().file, 'application/javascript');
}

app.run();
