var fs = require('fs');

angular.module('app').service('BookService', function(KindleGenService, SystemService, LogService) {
  
  this.transferBook = function(book, cb) {
    this.isOnKindle(book, function(onKindle) {
      if (onKindle) {
        LogService.trace("book already on kindle: ", book);
        cb(true);
        return;
      }
    })

    KindleGenService.convertBook(book.pathToOpf, book.mobiFile, function(success) {
      if (!success) {
        LogService.error("kindlegen failed for '%s', aborting transfer", book.title);
        cb(success);
        return;
      }

      SystemService.commandExists('ebook-convert', function(exists) {
        if (!exists) {
          LogService.trace("ebook-convert not found, '%s' will be in Docs", book.title);
          cb(success);
          return;
        }

        var tempMobi = book.mobiFile.replace(/\.mobi$/, "-temp.mobi");
        fs.renameSync(book.mobiFile, tempMobi);

        LogService.trace("invoking ebook-convert %s %s", tempMobi, book.mobiFile);
        exec("ebook-convert " + tempMobi + " " + book.mobiFile, function(error, stdout, stderr) {
          if (error !== null) {
            LogService.error("ebook-convert error: ", error);
          }
          LogService.trace("ebook-convert stdout: ", stdout);
          LogService.trace("ebook-convert stderr: ", stderr);
          
          LogService.trace("deleting %s", tempMobi);
          fs.unlink(tempMobi, function() {
            cb(success);
          });
        });
      });
    });
  };

  this.removeBook = function(book, cb) {
    this.isOnKindle(book, function(onKindle) {
      if (!onKindle) {
        LogService.trace("book already removed from kindle: ", book);
        cb(true);
        return;
      }
    });

    LogService.trace("removing '%s' from kindle", book.title);
    fs.unlink(book.mobiFile, function() {
      cb(true);
    })
  };

  this.isOnKindle = function(book, cb) {
    fs.exists(book.mobiFile, cb);
  };

});
