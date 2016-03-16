/**
 * Dish configuration manager. Public functions are exported at the end of the
 * module.
 */
const fs = require('fs');
const urllib = require('urllib');
const argv = require('yargs').argv;
const csvtojson = require('csvtojson');
const prettyjson = require('prettyjson');

/**
* Main namespace.
*/
var cnf = {
  uidPattern: new RegExp('^[a-zA-Z]{1}[a-zA-Z0-9]{10}$'),
  config: undefined,
  configFile: undefined,
  configLocation: undefined,
  configFilename: 'dish.json'
}

/**
* Returns the config.
*/
cnf.getConf = function() {
  if (cnf.config) {
    return cnf.config;
  }
  else {
    return cnf.initAndGetConf();
  }
}

/**
* Returns a basic authentication string.
*/
cnf.getAuth = function() {
  return cnf.getConf().api.username + ':' + cnf.getConf().api.password;
}

/**
* Returns a JSON suitable for network operations.
*/
cnf.getOptions = function() {
  return {
    get: {
      auth: cnf.getAuth(),
      method: 'get',
      timeout: 3600000
    },
    post: {
      auth: cnf.getAuth(),
      method: 'post',
      timeout: 3600000
    },
    delete: {
      auth: cnf.getAuth(),
      method: 'delete',
      timeout: 3600000
    }
  };
}

/**
* Returns the command line arguments as an object.
*/
cnf.getArgs = function() {
  return argv;
}

/**
* Indicates if the given argument was provided from the command line.
* @param arg the argument.
*/
cnf.isArg = function(arg) {
  return !!(argv[arg] && argv[arg].length);
}

/**
* Indicates whether the given string is a valid UID.
* @param str the string to test.
*/
cnf.isUid = function(str) {
  if (!str || !str.length) {
    return false;
  }

  return cnf.uidPattern.test(str);
}

/**
* Appends a query parameter and value to the given URL.
* @param url the url.
* @param param the query parameter.
* @param val the value.
*/
cnf.setQueryParam = function(url, param, val) {
  var sep = url.indexOf('?') !== -1 ? '&' : '?';
  url = url + sep + param + '=' + val;
  return url;
}

/**
 * Reads the CSV file and converts the content to JSON.
 * @param doneFn callback to apply with the JSON structure.
 */
cnf.convertCsvToJson = function(doneFn) {
    var Converter = require('csvtojson').Converter;
    var converter = new Converter({});
    converter.on('end_parsed', doneFn);
    fs.createReadStream(cnf.getArgs()['file']).pipe(converter);
}

/**
* Invokes a POST request.
* @param url the URL to post to.
* @param file the path to the file with the content to include as request payload.
* @param contentType the content type for the HTTP request.
*/
cnf.postFile = function(url, file, contentType) {
  var options = cnf.getOptions().post;
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
* POST JSON data structure.
* @param url the URL to post to.
* @param json the JSON data structure to use as payload.
*/
cnf.postJson = function(url, json) {

  var isPayloadFile = !!cnf.isArg('payload-file'),
    payloadfile = cnf.getArgs()['payload-file'],
    isOutputFile = !!cnf.isArg('output-file'),
    outputFile = cnf.getArgs()['output-file'];

  if (isPayloadFile) {
    fs.writeFile(payloadfile, JSON.stringify(json));
  }

  var options = cnf.getOptions().post;
  options.content = JSON.stringify(json);
  options.headers = {
    'Content-Type': 'application/json'
  };

  console.log('Sending JSON data..');
  console.log('POST URL: ' + url);

  urllib.request(url, options, function(err, data, result) {

    var dataStr = data ? data.toString('utf8') : '';

    if (200 == result.status || 201 == result.status) {
      var resp = JSON.parse(dataStr);

      console.log('JSON data successfully imported');

      if (isOutputFile) {
        var outputFile = outputFile,
          output = JSON.stringify(resp, null, 4);
        fs.writeFile(outputFile, output, 'utf8');
        console.log('Output written to: ' + outputFile);
      }
      else {
        console.log(prettyjson.render(resp));
      }
    }
    else {
      console.log('JSON data import failed');
      console.log('HTTP status code: ' + result.status);
      console.log('Error: ' + err);
      console.log('Response: ' + dataStr);
    }
  });
}

/**
* Initalizes configuration.
*/
cnf.initAndGetConf = function() {
  var dhisHome = process.env.DHIS2_HOME,
      osHome = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

  if (dhisHome) {
    cnf.configLocation = dhisHome + '/' + cnf.configFilename;
    console.log('Using DHIS2_HOME environment variable pointing to: ' + cnf.configLocation);
  }
  else if (osHome) {
    cnf.configLocation = osHome + '/' + cnf.configFilename;
    console.log('Using your home directory which seems to be: ' + cnf.configLocation);
  }
  else {
    cnf.configLocation = cnf.configFilename;
    console.log('Falling back to default config location: ' + cnf.configLocation);
  }

  try {
    cnf.configFile = fs.readFileSync(cnf.configLocation, 'utf8');
  }
  catch (ex) {
    throw new Error('Configuration file "dish.json" was not found or could not be parsed');
  }

  cnf.config = JSON.parse(cnf.configFile);
  return cnf.config;
}

/**
* Public functions.
*/
module.exports.getConf = cnf.getConf;
module.exports.getAuth = cnf.getAuth;
module.exports.getOptions = cnf.getOptions;
module.exports.getArgs = cnf.getArgs;
module.exports.isArg = cnf.isArg;
module.exports.isUid = cnf.isUid;
module.exports.setQueryParam = cnf.setQueryParam;
module.exports.convertCsvToJson = cnf.convertCsvToJson;
module.exports.postFile = cnf.postFile;
module.exports.postJson = cnf.postJson;
