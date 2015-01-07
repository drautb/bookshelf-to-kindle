var path = require('path'),
    fs = require('fs'),
    os = require('os'),
    glob = require('glob'),
    mkdirp = require('mkdirp');

function Book(pathToBook) {
  this.pathToBook = pathToBook;
  this.previewImg = path.join(pathToBook, 'db', 'preview.png').replace(/\\/g, '/');

  this.pathToOpf = glob.sync(path.join(pathToBook, '**', '*.opf'))[0];

  var opfDataString = fs.readFileSync(this.pathToOpf);
  this.title = opfDataString.toString().match(/<dc:title>(.*)<\/dc:title>/)[1];

  this.mobiFilename = this.title.toLowerCase().replace(/\W/g, '-').replace(/--+/g, '-') + '.mobi';

  var kindleBooksPath = (os.platform() === 'win32') ? '' : '/';
  var segments = pathToBook.split("/");
  for (var s=0; s<segments.length; s++) {
    kindleBooksPath = path.join(kindleBooksPath, segments[s]);
    if (segments[s] === "com.deseretbook.bookshelf") {
      kindleBooksPath = path.join(kindleBooksPath, segments[s+1], "converted-books");
      mkdirp.sync(kindleBooksPath);
      break;
    }
  }

  this.mobiFile = path.join(kindleBooksPath, this.mobiFilename);
}

global.module.exports = Book;
