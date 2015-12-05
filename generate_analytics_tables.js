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
  urlsync.request(app.analyticsTableUrl, app.postOptions);
  console.log('Analytics table generation process started!');
}

app.generateAnalyticsTables();
