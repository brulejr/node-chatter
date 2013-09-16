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

  controllers.controller('PageCtrl', function($scope, $dialog, $location, $anchorScroll, chatService) {

    $scope.currentName = "";
    $scope.currentRoom = "";
    $scope.messages = [ ];
    $scope.roomList = [ ];
    $scope.hasFocus = true;

    $scope.chatForm = {
    	message: ""
    };

    var msgnum = 1;

    $scope.handleUserInput = function() {
    	var message = $scope.chatForm.message;
    	if (message[0] == '/') {
    		chatService.sendCommand(message);
      } else {
    		chatService.sendMessage($scope.currentRoom, message);
        pushMessage($scope.currentName + ': ' + message);
      }
  	  $scope.chatForm.message = "";
	  };

    $scope.joinRoom = function(room) {
      if (room !== $scope.currentRoom) {
        chatService.joinRoom(room);
      }
    };

    $scope.openAboutDialog = function() {
      var d = $dialog.dialog({
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: '/view/about'
      });
      d.open();
    };
  
    $scope.closeDialog = function(result) {
      dialog.close(result);
    };

    var pushMessage = function(message) {
      $scope.messages.push({ id: ++msgnum, text: message });
      $location.hash('msg' + msgnum);
      $anchorScroll();
    }

    $scope.$on('JoinRoomEvent', function(event, room) {
    	$scope.currentRoom = room;
    	$scope.$apply();
    });

    $scope.$on('MessageEvent', function(event, message) {
      pushMessage(message);
      $scope.$apply();
    });

    $scope.$on('NameChangeEvent', function(event, name) {
      $scope.currentName = name;
      $scope.$apply();
    });

    $scope.$on('RoomsEvent', function(event, rooms) {
    	$scope.roomList = rooms;
    	$scope.$apply();
    });

  });

}());