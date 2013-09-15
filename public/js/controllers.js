/*
 * chat-client: controllers.js
 * AngularJS controllers for the chat application
 *
 * Copyright (c) 2013 Jon Brule
 * Licensed under the MIT license.
 */
(function() {
  'use strict';

  var controllers = angular.module('app.controllers', []);

  controllers.controller('ChatCtrl', function($scope) {

    var socket = io.connect();
  	var chatApp = new Chat(socket);

  });

}());