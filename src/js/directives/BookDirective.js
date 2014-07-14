angular.module('app').directive('btkBook', function() {
  return {
    restrict: 'E',
    scope: {
      book: '=bookModel'
    },
    templateUrl: 'js/directives/templates/BookTemplate.html'
  };
});
