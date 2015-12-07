/**
 * Dish configuration manager.
 */
const fs = require('fs');
const urllib = require('urllib');
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
* Returns a JSON suitable for network operations.
*/
exports.getOptions = function() {
  return {
    get: {
      auth: this.getAuth(),
      method: 'get',
      timeout: 60000
    },
    post: {
      auth: this.getAuth(),
      method: 'post',
      timeout: 60000
    },
    delete: {
      auth: this.getAuth(),
      method: 'delete',
      timeout: 60000
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
* Invokes a POST request.
* @param url the URL to post to.
* @param file the path to the file with the content to include as request payload.
* @param contentType the content type for the HTTP request.
*/
exports.postFile = function(url, file, contentType) {
  fs.readFile(file, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }

    var options = conf.getOptions().post;
    options.data = data;
    options.headers = {
      'Content-Type': contentType
    };

    urllib.request(url, options).then(function(result) {
      if (200 == result.status || 201 == result.status) {
        console.log('Content successfully uploaded: ' + conf.getArgs().dataset);
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
  var loc = process.env.DHIS2_HOME;

  if (loc) {
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
