#!/usr/bin/env node
const conf = require('./configManager.js');
const app = {};

app.postSetting = function() {
  var setting = cnf.getArgs()['setting'],
    value = cnf.getArgs()['value'];

  var options = cnf.getOptions().post;
  options.headers = {
    'Content-Type': 'text/plain'
  };

  var url = conf.getConf().dhis.baseurl + '/api/systemSettings/' + setting + '?value=' + value;

  urllib.request(url, options, function(err, data, result) {
  });
}
