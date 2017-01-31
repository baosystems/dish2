#!/usr/bin/env node
const csvtojson = require('csvtojson');
const urlsync = require('urllib-sync');
const fs = require('fs');
const conf = require('./configManager.js');

const app = {
  delBaseUrl: conf.getConf().dhis.baseurl + '/api/' + conf.getArgs()['object-type'],
  deleteCount: 0,
  errorCount: 0
}

app.removeObjects = function(objects) {
  var obj, url, delResp;

  for (var i = 0; i<objects.length; i++) {
    obj = objects[i];
    url = app.delBaseUrl + '/' + obj.id;

    delResp = urlsync.request(url, conf.getOptions().delete);

    if (delResp && conf.is2xx(delResp.status)) {
      console.log('Object successfully deleted: ' + obj.id);
      app.deleteCount++;
    }
    else {
      console.log('Object could not be deleted: ' + obj.id);
      console.log('Status code: ' + delResp.status)
      app.errorCount++;
    }
  }

  console.log('Process completed!');
  console.log('Objects deleted: ' + app.deleteCount);
  console.log('Total no of objects: ' + objects.length);
  console.log('Errors occured: ' + app.errorCount);
}

/**
* Runs command.
*/
app.run = function() {
  if (!conf.isArg('file') || !conf.isArg('object-type')) {
    return console.log('Usage: remove_objects --file <name-of-input-csv-file> --object-type <object-type-name>');
  }

  conf.convertCsvToJson(app.removeObjects);
}

app.run();
