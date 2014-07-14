var fs = require('fs'),
    os = require('os'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    exec = require('child_process').exec;

function getFSRoot() {
  return (os.platform() === 'win32') ? process.cwd().split(path.sep)[0] : '/';
}

function getAppDataDir(logger) {
  var userHome = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
  var appDataDir = path.join(userHome, ".bookshelf-to-kindle");

  logger.trace("Ensuring that " + appDataDir + " exists.");
  mkdirp.sync(appDataDir);

  return appDataDir;
}

angular.module('app').service('SystemService', function(LogService) {
  var platform = os.platform();
  var fsRoot = getFSRoot();

  this.appDataDir = getAppDataDir(LogService);
  this.devicesLocation = fsRoot;
  
  if (platform === 'darwin') {
    this.devicesLocation = path.join(fsRoot, 'Volumes');
  } else if (platform === 'linux') {
    this.devicesLocation = path.join(fsRoot, 'media');
  }

  this.refreshDevices = function(cb) {
    this.readdir(this.devicesLocation, cb);
  };

  this.commandExists = function(command, cb) {
    var child = exec(command, function(error, stdout, stderr) {
      if (error !== null && error.toString().match(/command not found/)) {
        cb(false);
      } else {
        cb(true);
      }
    });
  };

  // Wraps Node's readdir, but filters out files I don't want.
  this.readdir = function(path, cb) {
    fs.readdir(path, function(err, list) {
      if (err) {
        LogService.error(err);
        throw err;
      }

      var filteredList = list.filter(function(item) {
        return !item.match(/^\./);
      });

      cb(filteredList);
    });
  };

  LogService.trace("SystemService Data: ", this);
});
