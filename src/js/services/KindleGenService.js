var fs = require('fs'),
    path = require('path'),
    os = require('os'),
    exec = require('child_process').exec,
    download = require('download'),
    glob = require('glob'),
    async = require('async'),
    Decompress = require('decompress'),
    DecompressZip = require('decompress-zip');

angular.module('app').service('KindleGenService', function(SystemService, LogService) {

  var self = this,
      platform = os.platform();

  this.kgData = {
    archiveUrl: 'http://kindlegen.s3.amazonaws.com/',
    archivePath: SystemService.appDataDir,
    extractDir: path.join(SystemService.appDataDir, 'kindlegen')
  };

  if (platform === 'win32' ) {
    this.kgData.archiveUrl += 'kindlegen_win32_v2_9.zip';
    this.kgData.archiveName = 'kindlegen.zip'
    this.kgData.executable = path.join(this.kgData.extractDir, 'kindlegen.exe');
  } else if (platform === 'darwin') {
    this.kgData.archiveUrl += 'KindleGen_Mac_i386_v2_9.zip';
    this.kgData.archiveName = 'kindlegen.zip'
    this.kgData.executable = path.join(this.kgData.extractDir, 'kindlegen');
  } else if (platform === 'linux') {
    this.kgData.archiveUrl += 'kindlegen_linux_2.6_i386_v2_9.tar.gz';
    this.kgData.archiveName = 'kindlegen.tar.gz'
    this.kgData.executable = path.join(this.kgData.extractDir, 'kindlegen');
  }
  this.kgData.archive = path.join(this.kgData.archivePath, this.kgData.archiveName);

  LogService.trace("kgData: ", this.kgData);

  var downloadArtifact = function(cb) {
    if (fs.existsSync(self.kgData.archive)) {
      LogService.trace("%s already exists, skipping download", self.kgData.archive);
      cb(); // Don't download it if it's already there.
      return;
    }

    LogService.trace("Downloading %s to %s", self.kgData.archiveUrl, self.kgData.archive);
    var emitter = download({url: self.kgData.archiveUrl, name: self.kgData.archiveName}, self.kgData.archivePath);
    
    emitter.on('close', function() {
      LogService.trace("download finished");
      cb();
    });
  };

  var extractZipArtifact = function(cb) {
    if (fs.existsSync(self.kgData.executable)) {
      LogService.trace("%s already exists, skipping extraction", self.kgData.executable);
      cb();
      return;
    }

    LogService.trace("Extracting %s to %s", self.kgData.archive, self.kgData.extractDir);
    var unzipper = new DecompressZip(self.kgData.archive);

    unzipper.on('error', function(err) {
      LogService.error('Error unzipping %s: ', self.kgData.archive, err);
    });

    unzipper.on('extract', function (log) {
      LogService.trace('finished extraction: ', log);
      cb();
    });

    unzipper.extract({ path: self.kgData.extractDir });
  };

  var extractTarArtifact = function(cb) {
    if (fs.existsSync(self.kgData.executable)) {
      LogService.trace("%s already exists, skipping extraction", self.kgData.executable);
      cb();
      return;
    }

    LogService.trace("Extracting %s to %s", self.kgData.archive, self.kgData.extractDir);
    var decompressor = new Decompress().src(self.kgData.archive)
                                       .dest(self.kgData.extractDir)
                                       .use(Decompress.targz());
    decompressor.decompress(cb);
  };

  var setExecutableMode = function(cb) {
    LogService.trace('making %s executable', self.kgData.executable);
    fs.chmod(self.kgData.executable, '0755', cb);
  };

  this.verifyInstall = function(cb) {
    var extractFunc = os.platform() === 'linux' ? extractTarArtifact : extractZipArtifact;
    async.series([
      downloadArtifact, extractFunc, setExecutableMode
    ], cb);
  };

  /**
   * KindleGen is stupid, and can't handle a full path as an output parameter. You can
   * only specify the output filename, and KindleGen creates an output file in the same 
   * location as the input file.
   *
   * So, convertBook accepts a path as an outputFile, gives kindlegen just the name, then after
   * the conversion, moves the output file to the path the consumre specified.
   */
  this.convertBook = function(inputFile, outputFile, cb) {
    LogService.trace("convertBook invoked with: %s, %s", inputFile, outputFile);

    var outputFilename = outputFile.match(/[\w-]+\.\w+$/)[0];
    var intermediateFile = inputFile.replace(/[\w-]+\.opf$/, outputFilename);

    exec(self.kgData.executable + " " + inputFile + " -o " + outputFilename, function(error, stdout, stderr) {
      var success = true;
      if (error !== null) {
        LogService.error("kindlegen error: ", error);
        success = false;
        if (stdout.toString().match(/Mobi file built/)) {
          success = true;
        }
      }
      LogService.trace("kindlegen stdout: ", stdout);
      LogService.trace("kindlegen stderr: ", stderr);

      LogService.trace("moving %s to %s", intermediateFile, outputFile);

      fs.rename(intermediateFile, outputFile, function() {
        cb(success);
      });
    });
  };

});
