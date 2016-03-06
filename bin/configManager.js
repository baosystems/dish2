/**
 * Dish configuration manager.
 */
const fs = require('fs');
const urllib = require('urllib');
const argv = require('yargs').argv;

/* TODO conf namespace */

var cnf = {
  uidPattern: new RegExp('^[a-zA-Z]{1}[a-zA-Z0-9]{10}$')
}

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
* Returns a JSON suitable for network operations.
*/
exports.getOptions = function() {
  return {
    get: {
      auth: this.getAuth(),
      method: 'get',
      timeout: 3600000
    },
    post: {
      auth: this.getAuth(),
      method: 'post',
      timeout: 3600000
    },
    delete: {
      auth: this.getAuth(),
      method: 'delete',
      timeout: 3600000
    }
  };
}

/**
* Returns the command line arguments as an object.
*/
exports.getArgs = function() {
  return argv;
}

/**
* Indicates if the given argument was provided from the command line.
*/
exports.isArg = function(arg) {
  return !!(argv[arg] && argv[arg].length);
}

/**
* Indicates whether the given string is a valid UID.
*/
exports.isUid = function(str) {
  if (!str || !str.length) {
    return false;
  }

  return cnf.uidPattern.test(str);
}

/**
 * Reads the CSV file and converts the content to JSON.
 * @param doneFn callback to apply with the JSON structure.
 */
exports.convertCsvToJson = function(doneFn) {
    var Converter = require('csvtojson').Converter;
    var converter = new Converter({});
    converter.on('end_parsed', doneFn);
    fs.createReadStream(this.getArgs()['file']).pipe(converter);
}

/**
* Invokes a POST request.
* @param url the URL to post to.
* @param file the path to the file with the content to include as request payload.
* @param contentType the content type for the HTTP request.
*/
exports.postFile = function(url, file, contentType) {
  var options = this.getOptions().post;
  options.headers = {
    'Content-Type': contentType
  };

  fs.readFile(file, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }

    options.data = data;

    urllib.request(url, options).then(function(result) {
      if (200 == result.status || 201 == result.status) {
        console.log('Content successfully uploaded');
      }
      else {
        console.log('Content could not be uploaded, HTTP status code: ' + result.status);
      }
    });
  });
}

/**
* Initalizes configuration.
*/
initAndGetConf = function() {
  var dhisHome = process.env.DHIS2_HOME,
      osHome = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

  if (dhisHome) {
    configLocation = dhisHome + '/' + configFilename;
    console.log('Using DHIS2_HOME environment variable pointing to: ' + configLocation);
  }
  else if (osHome) {
    configLocation = osHome + '/' + configFilename;
    console.log('Using your home directory which seems to be: ' + configLocation);
  }
  else {
    configLocation = configFilename;
    console.log('Falling back to default config location: ' + configLocation);
  }

  try {
    configFile = fs.readFileSync(configLocation, 'utf8');
  }
  catch (ex) {
    throw new Error('Configuration file "dish.json" was not found or could not be parsed');
  }

  config = JSON.parse(configFile);
  return config;
}
