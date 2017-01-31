#!/usr/bin/env node
const conf = require('./configManager.js');
const app = {};

app.run = function() {
  if (!conf.isArg('file')) {
    return console.log('Usage: post_css --file <css-file>');
  }

  var url = conf.getConf().dhis.baseurl + '/api/files/style';
  conf.postFile(url, conf.getArgs().file, 'text/css');
}

app.run();
