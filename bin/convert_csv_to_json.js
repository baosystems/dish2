#!/usr/bin/env node
const csvtojson = require('csvtojson');
const fs = require('fs');
const prettyjson = require('prettyjson');
const conf = require('./configManager.js');

const app = {
  outputFilename: 'out.json'
}

app.writeJson = function(objects) {
  var outFilename = conf.isArg('output-file') ? conf.getArgs()['output-file'] : app.outputFilename;
  console.log('Writing to file: ' + outFilename);
  fs.writeFile(outFilename, JSON.stringify(objects));
}

app.run = function() {
  if (!conf.isArg('file')) {
    return console.log('Usage: node convert_csv_to_json --file <name-of-csv-file> --output-file <name-of-json-file>');
  }

  console.log('Reading from file: ' + conf.getArgs()['file']);

  conf.convertCsvToJson(app.writeJson);
}

app.run();
