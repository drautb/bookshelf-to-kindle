var fs = require('fs'),
    os = require('os'),
    path = require('path'),
    Book = require('./js/models/book');

angular.module('app').service('DeviceService', function(SystemService, BookService, LogService) {
  this.bookshelfPath = path.join('Android', 'data', 'com.deseretbook.bookshelf');

  this.accounts = [];

  this.hasBookshelf = function(device, cb) {
    LogService.trace("hasBookshelf invoked with %s", device);
    var pathToBookshelf = path.join(SystemService.devicesLocation, device, this.bookshelfPath);
    fs.exists(pathToBookshelf, function(exists) {
      LogService.trace("fs.exists(" + pathToBookshelf + ") returned %s", exists);
      cb(exists);
    });
  };

  this.refreshAccounts = function(device, cb) {
    LogService.trace("refreshAccounts invoked with %s", device);
    var pathToBookshelf = path.join(SystemService.devicesLocation, device, this.bookshelfPath);
    SystemService.readdir(pathToBookshelf, function(accounts) {
      LogService.trace("SystemService.readdir(" + pathToBookshelf + ") returned ", accounts);
      cb(accounts);
    });
  };

  this.refreshBooks = function(device, account, cb) {
    var pathToBooks = path.join(SystemService.devicesLocation, device, this.bookshelfPath, account, 'books')
        self = this;

    LogService.trace("refreshBooks invoked with %s, %s", device, account);
    
    SystemService.readdir(pathToBooks, function(bookDirList) {
      LogService.trace("SystemService.readdir(" + pathToBooks + ") returned ", bookDirList);

      var books = [];
      bookDirList.forEach(function(bookDir) {
        var b = new Book(path.join(pathToBooks, bookDir));
        LogService.trace("new Book: ", b);
        books.push(b);
      });

      cb(books);
    });
  };

  this.getAccounts = function(device, cb) {
    this.refreshAccounts(device, cb);
  };

  this.getBooks = function(device, account, cb) {
    this.refreshBooks(device, account, cb);
  };
});
