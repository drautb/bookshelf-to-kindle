var gui = require('nw.gui');

angular.module("app").controller("MainController", ["$scope", "$window", "DeviceService", "SystemService", "KindleGenService", function($scope, $window, DeviceService, SystemService, KindleGenService) {
  
  $scope.hardRefresh = function() {
    $window.location.reload();
  };

  $scope.refresh = function() {
    SystemService.refreshDevices(function (devices) {
      $scope.devices = devices;
      $scope.$apply();
    });

    SystemService.commandExists('ebook-convert', function(exists) {
      $scope.showCalibreWarning = !exists;
      $scope.$apply();
    });
    
    $scope.currentDevice = "";

    $scope.accounts = [];
    $scope.currentAccount = "";

    $scope.books = [];

    $scope.bookshelfFound = false;
    $scope.message = "Select your Kindle device from the dropdown menu above.";
  };

  $scope.deviceChange = function() {
    var device = $scope.currentDevice;

    $scope.accounts = [];
    $scope.currentAccount = "";
    $scope.books = [];
    $scope.message = '';

    DeviceService.hasBookshelf(device, function(bookshelfFound) {
      $scope.bookshelfFound = bookshelfFound;

      if ($scope.bookshelfFound) {
        $scope.message = "Select your Bookshelf account from the dropdown menu above.";
        DeviceService.getAccounts(device, function(accounts) {
          $scope.accounts = accounts;
          $scope.$apply();
        });
      } else {
        $scope.message = "We couldn't find the Bookshelf app on that device.";
        $scope.$apply();
      }
    });
  };

  $scope.refreshBooks = function() {
    var account = $scope.currentAccount;
    DeviceService.getBooks($scope.currentDevice, account, function(books) {
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
    if ($scope.currentDevice === "") {
      return false;
    }

    return !$scope.bookshelfFound;
  };

  $scope.selectAccount = function() {
    if ($scope.noBookshelf()) {
      return false;
    }

    return $scope.accounts.length > 0;
  }

  $scope.message = "This program needs Amazon's KindleGen tool to work properly, we're downloading it now. This shouldn't take more than a couple of minutes.";

  KindleGenService.verifyInstall(function(err, results) {
    $scope.refresh();
  });
  
}]);
