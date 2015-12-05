/**
 * Dish config manager.
 *
 * The script requires nodejs depends on these libraries:
 *
 * npm install csvtojson
 * npm install urllib-sync
 * npm install yargs
 */

const fs = require('fs');
const argv = require('yargs').argv;

var config,
    configFile,
    configLocation,
    configFilename = 'dish.json';

/**
* Returns the config.
*/
exports.getConf = function() {
  if (config) {
    return config;
  }
  else {
    return initAndGetConf();
  }
}

/**
* Returns a basic authentication string.
*/
exports.getAuth = function() {
  return this.getConf().api.username + ':' + this.getConf().api.password;
}

/**
* Returns the "file" command line argument.
*/
exports.getFile = function() {
  return argv.file;
}

/**
* Initalizes configuration.
*/
initAndGetConf = function() {

  var loc = process.env.DHIS2_HOME;

  if(loc) {
    configLocation = loc + '/' + configFilename;
    console.log('DHIS2_HOME environment variable pointing to: ' + loc);
  }
  else {
    configLocation = configFilename;
    console.log('Warning, DHIS2_HOME environment variable not set, using default config location');
  }

  try {
    configFile = fs.readFileSync(configLocation, 'utf8');
  }
  catch (ex) {
    throw new Error('Configuration file "conf.json" was not found or could not be parsed');
  }

  config = JSON.parse(configFile);
  return config;
}
