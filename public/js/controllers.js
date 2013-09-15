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

  controllers.controller('ChatCtrl', function($scope, chatService) {

    $scope.currentRoom = "";
    $scope.messages = [ ];
    $scope.roomList = [ ];

    $scope.chatForm = {
    	message: ""
    };

    $scope.handleUserInput = function() {
    	var message = $scope.chatForm.message;
    	if (message[0] == '/') {
    		chatService.sendCommand(message);
      } else {
    		chatService.sendMessage($scope.currentRoom, message);
    		$scope.messages.push(message);
      }
  	  $scope.chatForm.message = "";
	  };

    $scope.$on('JoinRoomEvent', function(event, room) {
    	$scope.currentRoom = room;
    	$scope.$apply();
    });

    $scope.$on('MessageEvent', function(event, message) {
    	$scope.messages.push(message);
    });

    $scope.$on('NameChangeEvent', function(event, name) {
    	console.log('NameChangeEvent', name);
    });

    $scope.$on('RoomsEvent', function(event, rooms) {
    	$scope.roomList = rooms;
    	$scope.$apply();
    });

  });

}());