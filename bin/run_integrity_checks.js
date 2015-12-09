#!/usr/bin/env node
const conf = require('./configManager.js');
const urlsync = require('urllib-sync');
const fs = require('fs');

/*
 * The flow of the command:
 *
 * - Get integrity checks in the form of SQL views from server.
 * - Get the result of each SQL view. The SQL views should return no records,
 *   and returned records are considered violations.
 * - Count number of violated views and records.
 * - Produce an integrity check summary.
 * - Write summary to file.
 * - Email the summary to server notifcation email using server Web API.
 */

const app = {
  sqlViewsUrl: conf.getConf().api.baseUrl + '/sqlViews.json?query=integrity_&fields=id,name,description&paging=false',
  sqlViewsBaseUrl: conf.getConf().api.baseUrl + '/sqlViews',
  emailUrl: conf.getConf().api.baseUrl + '/email/notification',
  resultsFilename: 'output.tmp',
  results: {
    failed: [],
    successful: []
  },
  violatedChecks: 0,
  violatedRows: 0
};

app.sendEmail = function(text) {
  var email = {
    subject: 'Integrity check summary: ' + app.violatedChecks + ' failed checks out of ' + app.sqlViews.length + ' on ' + new Date().toString(),
    text: text
  };

  var postOptions = {
    auth: conf.getOptions().get.auth,
    timeout: conf.getOptions().get.timeout,
    data: JSON.stringify(email),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post'
  };

  var response = urlsync.request(app.emailUrl, postOptions);

  if (response && 200 == response.status) {
    console.log('Email sent');
  }
  else {
    console.log('Email failed');
    console.log(response);
  }
}

app.run = function() {
  console.log('Getting integrity checks at: ' + app.sqlViewsUrl);

  var sqlViewResp = urlsync.request(app.sqlViewsUrl, conf.getOptions().get);
  var sqlViewJson = JSON.parse(sqlViewResp.data.toString('utf8'));
  app.sqlViews = sqlViewJson.sqlViews;

  console.log('Running integrity checks');

  for (var i=0; i < app.sqlViews.length; i++) {
    var sqlView = app.sqlViews[i];
    var url = app.sqlViewsBaseUrl + '/' + sqlView.id + '/data.json';

    var response = urlsync.request(url, conf.getOptions().get);
    var data = response.data;

    var result = {};
    result.description = sqlView.description;
    result.url = url;

    if (200 == response.status) {
      var json = JSON.parse(data.toString('utf8'));

      if (json.rows && json.rows.length > 0) {
        result.status = 'FAILED';
        result.violations = json.rows.length;
        app.violatedChecks++;
        app.violatedRows += json.rows.length;
        app.results.failed.push(result);
      }
      else {
        result.status = 'SUCCESSFUL';
        app.results.successful.push(result);
      }
    }
    else {
      result.status = 'ERROR';
      result.message = 'The SQL view failed to generate, check the logs';
    }

    console.log('Got results for check: ' + sqlView.name + ', violations: '  + json.rows.length + ', HTTP status: ' + response.status);
  }

  console.log('Writing integrity check results');

  var prettyResults = JSON.stringify(app.results, null, 2);

  fs.writeFile(app.resultsFilename, prettyResults, 'utf8');

  console.log('Summary');
  console.log('-------');
  console.log('Violated checks: ' + app.violatedChecks);
  console.log('Violated rows: ' + app.violatedRows);
  console.log('-------');

  console.log('Sending email');

  app.sendEmail(prettyResults);

  console.log('Integrity checks done');
}

app.run();
