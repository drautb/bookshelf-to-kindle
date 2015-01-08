var path = require('path'),
    fs = require('fs'),
    glob = require('glob'),
    mkdirp = require('mkdirp');

function Book(pathToBook) {
  this.pathToBook = pathToBook;
  this.previewImg = path.join(pathToBook, 'db', 'preview.png').replace(/\\/g, '/');

  this.pathToOpf = glob.sync(path.join(pathToBook, '**', '*.opf'))[0];

  var opfDataString = fs.readFileSync(this.pathToOpf);
  this.title = opfDataString.toString().match(/<dc:title>(.*)<\/dc:title>/)[1];

  this.mobiFilename = this.title.toLowerCase().replace(/\W/g, '-').replace(/--+/g, '-') + '.mobi';

  var segments = pathToBook.split(path.sep);
  if (os.platform() === "win32") {
    segments[0] = "";
  }

  var kindleBooksPath = path.join((os.platform() === 'win32') ? '' : '/', path.sep);
  for (var s=0; s<segments.length; s++) {
    kindleBooksPath = path.join(kindleBooksPath, segments[s]);
    if (segments[s] === "com.deseretbook.bookshelf") {
      kindleBooksPath = path.join(kindleBooksPath, segments[s+1], "converted-books");
      console.log("Calling mkdirp with " + kindleBooksPath);
      mkdirp.sync(kindleBooksPath);
      break;
    }
  }

  this.mobiFile = path.join(kindleBooksPath, this.mobiFilename);
}

global.module.exports = Book;
