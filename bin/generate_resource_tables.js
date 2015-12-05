/**
 * Command which starts the resource table generation process.
 */

 const urlsync = require('urllib-sync');
 const conf = require('./configManager.js');

 const app = {
   postOptions: {
     auth: conf.getAuth(),
     method: 'post',
     timeout: 60000
   },
   resourceTableUrl: conf.getConf().api.baseUrl + '/resourceTables'
}

app.generateResourceTables = function() {
  var resp = urlsync.request(app.resourceTableUrl, app.postOptions);

  if (200 == resp.status) {
    console.log('Resource table generation process started!');
  }
  else {
    console.log('Resource table generation could not be initiated, HTTP status: ' + resp.status);
  }
}

app.generateResourceTables();
