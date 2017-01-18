#!/usr/bin/env node
const csvtojson = require('csvtojson');
const urlsync = require('urllib-sync');
const fs = require('fs');
const conf = require('./configManager.js');

const app = {
  orgUnitsUrl: conf.getConf().dhis.baseurl + '/api/organisationUnits',
  pruneUrl: conf.getConf().dhis.baseurl + '/api/maintenance/dataPruning/organisationUnits',
  filename: conf.getArgs().file,
  deleteCount: 0,
  errorCount: 0
}

/**
 * Removes org units provided as the given json structure.
 * @param json the organisation units to remove.
 */
app.removeOrgUnits = function(orgUnits) {
  var obj,
      prop,
      props = ['id','name','code'];

  for (var i=0; i<orgUnits.length; i++) {
    obj = orgUnits[i];

    for (var j=0; j<props.length; j++) {
      prop = props[j];
      if (obj.hasOwnProperty(prop) && app.removeOrgUnit(obj,prop)) {
        break;
      }
    }
  }

  console.log('Process completed!');
  console.log('Org units deleted: ' + app.deleteCount);
  console.log('Total no of org units: ' + orgUnits.length);
  console.log('Errors occured: ' + app.errorCount);
}

/**
 * Deletes the given org unit using the DHIS 2 Web API.
 * @param obj the org units.
 * @param prop the property name, can be "name", "uid", "code".
 * @returns {boolean} true if the org unit was deleted, false otherwise.
 */
app.removeOrgUnit = function(obj,prop) {
  var ouResp, ous, ou, delUrl, delResp;
  var url = app.orgUnitsUrl + '.json?paging=false&filter=' + prop + ':eq:' + obj[prop];

  ouResp = urlsync.request(url, conf.getOptions().get);
  ous = JSON.parse(ouResp.data.toString('utf8'));

  if (ous && ous.organisationUnits && ous.organisationUnits[0]) {
    ou = ous.organisationUnits[0];
    delDataUrl = app.pruneUrl + '/' + ou.id;
    delOuUrl = app.orgUnitsUrl + '/' + ou.id;

    delDataResp = urlsync.request(delDataUrl, conf.getOptions().post);

    if (delDataResp && conf.is2xx(delDataResp.status)) {
      console.log('Data for org unit successfully deleted, id: ' + ou.id + ', name: ' + ou.name);
    }
    else {
      console.log(delDataResp);
      console.log('Data for org unit could not be deleted, id: ' + ou.id + ', name: ' + ou.name);
    }

    delOuResp = urlsync.request(delOuUrl, conf.getOptions().delete);

    if (delOuResp && 204 == delOuResp.status) {
      console.log('Org unit successfully deleted: ' + ou.id + ', ' + ou.name);
      app.deleteCount++;
      return true;
    }
    else {
      console.log('Org unit could not be deleted: ' + ou.id + ', ' + ou.name);
      app.errorCount++;
    }
  }
  else {
    console.log('Org unit not found: "' + obj.name + '" using prop: "' + prop + '"');
      app.notFoundCount++;
  }

  return false;
}

/**
* Runs command.
*/
app.run = function() {
  if (!conf.isArg('file')) {
    return console.log('Usage: node remove_org_units --file <name-of-org-unit-csv-file>');
  }

  conf.convertCsvToJson(app.removeOrgUnits);
}

app.run();
