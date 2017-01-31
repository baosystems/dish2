#!/usr/bin/env node
const urlsync = require('urllib-sync');
const conf = require('./configManager.js');

const app = {};

app.postSetting = function() {
  var setting = conf.getArgs()['setting'],
    value = conf.getArgs()['value'];

  var options = conf.getOptions().post;
  options.headers = {
    'Content-Type': 'text/plain'
  };

  var url = conf.getConf().dhis.baseurl + '/api/systemSettings/' + setting + '?value=' + value;
  var resp = urlsync.request(url,options);

  if (resp && conf.is2xx(resp.status)) {
    console.log('System setting "' + setting + '" created');
  }
  else {
    console.log('Could not create system setting, status: ' + resp.status)
  }
}

/**
* Runs command.
*/
app.run = function() {
  if (!conf.isArg('setting') || !conf.isArg('value')) {
    return console.log('Usage: set_system_setting --setting <name-of-system-setting> --value <value>');
  }

  app.postSetting();
}

app.run();
