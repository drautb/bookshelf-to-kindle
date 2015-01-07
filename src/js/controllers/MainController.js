var gui = require('nw.gui');

angular.module("app").controller("MainController", [
  "$scope",
  "$window",
  "BookshelfService",
  "KindleGenService",
  "LogService",
  "SystemService",
  function(
    $scope,
    $window,
    BookshelfService,
    KindleGenService,
    LogService,
    SystemService
  ) {

  $scope.hardRefresh = function() {
    $window.location.reload();
  };

  $scope.refresh = function() {
    SystemService.commandExists('ebook-convert', function(exists) {
      $scope.showCalibreWarning = !exists;
      $scope.$apply();
    });

    $scope.accounts = [];
    $scope.currentAccount = "";

    $scope.books = [];

    $scope.locateBookshelf();
  };

  $scope.locateBookshelf = function() {
    var bookshelf = BookshelfService.pathToBookshelf;

    $scope.accounts = [];
    $scope.currentAccount = "";
    $scope.books = [];
    $scope.message = '';

    BookshelfService.bookshelfExists(function(bookshelfFound) {
      $scope.bookshelfFound = bookshelfFound;

      if ($scope.bookshelfFound) {
        $scope.message = "Select your Bookshelf account from the dropdown menu above.";
        BookshelfService.getAccounts(function(accounts) {
          $scope.accounts = accounts;
          $scope.$apply();
        });
      } else {
        $scope.message = "We couldn't find the Bookshelf folder on your desktop.";
        $scope.$apply();
      }
    });
  };

  $scope.refreshBooks = function() {
    var account = $scope.currentAccount;
    BookshelfService.getBooks(account, function(books) {
      $scope.books = books;
      $scope.message = "";
      $scope.$apply();
    });
  };

  $scope.downloadCalibre = function() {
    gui.Shell.openExternal('http://calibre-ebook.com/');
    $scope.showCalibreWarning = false;
  };

  $scope.noBookshelf = function() {
    if ($scope.currentBookshelf === "") {
      return false;
    }

    return !$scope.bookshelfFound;
  };

  $scope.selectAccount = function() {
    if ($scope.noBookshelf()) {
      return false;
    }

    return $scope.accounts.length > 0;
  };

  $scope.message = "This program needs Amazon's KindleGen tool to work properly, we're downloading it now. This shouldn't take more than a couple of minutes.";

  KindleGenService.verifyInstall(function(err, results) {
    $scope.refresh();
  });

}]);
