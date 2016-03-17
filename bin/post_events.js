#!/usr/bin/env node
const csvtojson = require('csvtojson');
const fs = require('fs');
const urllib = require('urllib');
const prettyjson = require('prettyjson');
const conf = require('./configManager.js');

const app = {
  postUrl: conf.getConf().api.baseUrl + '/events',
  fixedProps: ['program', 'orgUnit', 'eventDate', 'status', 'storedBy']
}

/**
* Post events.
*/
app.postEvents = function(events) {
  var payload = app.getEvents(events),
    url = app.postUrl;

  if (conf.isArg('org-unit-id-scheme')) {
    url = conf.setQueryParam(url, 'orgUnitIdScheme', conf.getArgs()['org-unit-id-scheme']);
  }

  if (conf.isArg('data-element-id-scheme')) {
    url = conf.setQueryParam(url, 'orgUnitIdScheme', conf.getArgs()['data-element-id-scheme']);
  }

  if (conf.isArg('id-scheme')) {
    url = conf.setQueryParam(url, 'idScheme', conf.getArgs()['id-scheme']);
  }

  conf.postJson(url, payload);
}

/**
* Returns an array of events.
*/
app.getEvents = function(events) {
  var payload = {
    events: []
  };

  for (var i=0; i<events.length; i++) {
    var evt = events[i];

    var obj = {
      coordinate: {},
      dataValues: []
    };

    Object.keys(evt).forEach(function(key,inx) {

      if (!evt[key] || evt[key] == '') {
        return;
      }

      if (app.fixedProps.indexOf(key) != -1) {
        obj[key] = evt[key];
      }
      else if ('longitude' == key) {
        obj.coordinate.longitude = evt[key];
      }
      else if ('latitude' == key) {
        obj.coordinate.latitude = evt[key];
      }
      else if (conf.isUid(key)) {
        var dv = {
          dataElement: key,
          value: evt[key]
        };

        obj.dataValues.push(dv);
      }
    });

    payload.events.push(obj);
  }

  return payload;
}

/**
* Runs command.
*/
app.run = function() {
  if (!conf.isArg('file')) {
    return console.log('Usage: node post_events --file <name-of-input-csv-file>');
  }

  console.log('Using file: ' + conf.getArgs()['file']);
  console.log('Parsing CSV file..');

  conf.convertCsvToJson(app.postEvents);
}

app.run();
