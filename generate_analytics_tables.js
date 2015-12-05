/**
 * Command which starts the analytics table generation process.
 */

 const urlsync = require('urllib-sync');
 const conf = require('./configManager.js');

 const app = {
   postOptions: {
     auth: conf.getAuth(),
     method: 'post',
     timeout: 60000
   },
   analyticsTableUrl: conf.getConf().api.baseUrl + '/resourceTables/analytics'
}

app.generateAnalyticsTables = function() {
  var resp = urlsync.request(app.analyticsTableUrl, app.postOptions);

  if (200 == resp.status) {
    console.log('Analytics table generation could not be initiated');
  }
  else {
    console.log('Analytics table generation could not be initiated, HTTP status: ' + resp.status);
  }
}

app.generateAnalyticsTables();
