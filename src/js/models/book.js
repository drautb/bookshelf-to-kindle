var path = require('path'),
    fs = require('fs'),
    glob = require('glob');

function Book(pathToBook) {
  this.pathToBook = pathToBook;
  this.previewImg = path.join(pathToBook, 'db', 'preview.png').replace(/\\/g, '/');

  this.pathToOpf = glob.sync(path.join(pathToBook, '**', '*.opf'))[0];

  var opfDataString = fs.readFileSync(this.pathToOpf);
  this.title = opfDataString.toString().match(/<dc:title>(.*)<\/dc:title>/)[1];
  
  this.mobiFilename = this.title.toLowerCase().replace(/\W/g, '-').replace(/--+/g, '-') + '.mobi';
  var kindleBooksPath = pathToBook.replace(/Android/, "Books").match(/.*Books/)[0];
  this.mobiFile = path.join(kindleBooksPath, this.mobiFilename);
};

module.exports = Book;
