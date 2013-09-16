/*
 * chat-client: directives.js
 * AngularJS directives for the chat application
 *
 * Copyright (c) 2013 Jon Brule
 * Licensed under the MIT license.
 */
(function() {
  'use strict';

  var directives = angular.module('app.directives', []);

  directives.directive('focus', function () {
    return function (scope, element, attrs) {
      attrs.$observe('focus', function (newValue) {
        newValue === 'true' && element[0].focus();
      });
    }
  });
  
}());