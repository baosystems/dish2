/**
 * Command that deletes organisation units.
 *
 * The following header column names are valid: "name", "uid" and "code". The
 * script will attempt to match on any specified column/property. Column names
 * are case-sensitive. You must specify at least one column.
 *
 * Example CSV file:
 *
 * "name","code"
 * "Johns clinic", "Fac021"
 * "Bobs dispensary", "Fac015"
 * "St Martas hospital","Fac042"
 */

const fs = require('fs');
const csvtojson = require('csvtojson');
const urlsync = require('urllib-sync');
const conf = require('./configManager.js');

const app = {
  getOptions: {
    auth: conf.getAuth(),
    timeout: 40000
  },
  deleteOptions: {
    auth: conf.getAuth(),
    method: 'delete',
    timeout: 40000
  },
  orgUnitsUrl: conf.getConf().api.baseUrl + '/organisationUnits',
  filename: conf.getFile(),
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
        props = ['name','code'];

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
    console.log();
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

    ouResp = urlsync.request(url, app.getOptions);
    ous = JSON.parse(ouResp.data.toString('utf8'));

    if (ous && ous.organisationUnits && ous.organisationUnits[0]) {
        ou = ous.organisationUnits[0];
        delUrl = app.orgUnitsUrl + '/' + ou.id;
        console.log('Delete URL: ' + delUrl);

        delResp = urlsync.request(delUrl, app.deleteOptions);

        if (delResp && 204 == delResp.status) {
            console.log('Org unit successfully deleted: ' + ou.id + ', ' + ou.name);
            app.deleteCount++;
            return true;
        }
        else {
            console.log('Org unit could not be deleted');
            console.log(delResp);
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
 * Reads the CSV file and converts the content to JSON.
 * @param doneFn callback to apply with the JSON structure.
 */
app.convertCsvToJson = function(doneFn) {
    var Converter = require('csvtojson').Converter;
    var converter = new Converter({});
    converter.on('end_parsed', doneFn);
    fs.createReadStream(conf.getFile()).pipe(converter);
}

/**
* Runs command.
*/
app.run = function() {
  if (!conf.getFile() || !conf.getFile().length) {
    console.log("Usage: node ./remove_org_units.js --file <name-of-org-unit-csv-file>");
    return;
  }

  app.convertCsvToJson(app.removeOrgUnits);
}

app.run();
