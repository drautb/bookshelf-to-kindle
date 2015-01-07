var fs = require('fs'),
    os = require('os'),
    path = require('path'),
    Book = require('./js/models/book');

angular.module('app').service('BookshelfService', function(SystemService, BookService, LogService) {
  this.pathToBookshelf = path.join(SystemService.pathToDesktop, 'com.deseretbook.bookshelf');

  this.accounts = [];

  this.bookshelfExists = function(cb) {
    LogService.trace("bookshelfExists invoked");
    fs.exists(this.pathToBookshelf, function(exists) {
      LogService.trace("fs.exists(" + this.pathToBookshelf + ") returned %s", exists);
      cb(exists);
    });
  };

  this.refreshAccounts = function(cb) {
    LogService.trace("refreshAccounts invoked");
    SystemService.readdir(this.pathToBookshelf, function(accounts) {
      LogService.trace("SystemService.readdir(" + this.pathToBookshelf + ") returned ", accounts);
      cb(accounts);
    });
  };

  this.refreshBooks = function(account, cb) {
    var pathToBooks = path.join(this.pathToBookshelf, account, 'books'),
        self = this;

    LogService.trace("refreshBooks invoked with account %s", account);

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

  this.getAccounts = function(cb) {
    this.refreshAccounts(cb);
  };

  this.getBooks = function(account, cb) {
    this.refreshBooks(account, cb);
  };
});
