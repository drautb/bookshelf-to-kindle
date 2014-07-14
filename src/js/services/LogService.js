var log4js = require('log4js'),
    path = require('path'),
    mkdirp = require('mkdirp');

var userHome = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
var logDir = path.join(userHome, ".bookshelf-to-kindle", "logs");

mkdirp(logDir);

var logFile = path.join(logDir, new Date().toString());

log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: logFile }
  ]
});

angular.module('app').service('LogService', function() {
  return log4js.getLogger();
});
