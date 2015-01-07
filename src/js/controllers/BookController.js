angular.module("app").controller("BookController", ["$scope", "BookshelfService", "SystemService", "BookService", function($scope, BookshelfService, SystemService, BookService) {

  $scope.activate = function() {
    $scope.hover = true;
  };

  $scope.deactivate = function() {
    $scope.hover = false;
  };

  $scope.activated = function() {
    return $scope.hover && !$scope.busy;
  };

  $scope.transfer = function() {
    $scope.busy = true;

    BookService.transferBook($scope.book, function(success) {
      $scope.onKindle = success;
      $scope.busy = false;
      $scope.$apply();
    });
  };

  $scope.remove = function() {
    $scope.busy = true;

    BookService.removeBook($scope.book, function(offKindle) {
      $scope.onKindle = !offKindle;
      $scope.busy = false;
      $scope.$apply();
    });
  };

  $scope.hover = false;

  BookService.isOnKindle($scope.book, function(onKindle) {
    $scope.onKindle = onKindle;
    $scope.$apply();
  });
}]);
