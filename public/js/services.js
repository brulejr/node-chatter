/*
 * chat-client: services.js
 * AngularJS services for the chat application
 *
 * Copyright (c) 2013 Jon Brule
 * Licensed under the MIT license.
 */
(function() {
  'use strict';

  var services = angular.module('app.services', []);

  services.factory('chatService', function($rootScope) {

    var socket = io.connect();
  	var chatApp = new Chat(socket);

    socket.on('joinResult', function(result) {
      $rootScope.$broadcast('JoinRoomEvent', result.room);
    });

    socket.on('message', function (message) {
      $rootScope.$broadcast('MessageEvent', message);
    });

    socket.on('nameResult', function(result) {
      if (result.success) {
        $rootScope.$broadcast('NameChangeEvent', result.name);
      } else {
        $rootScope.$broadcast('NameInUseEvent', result.message);
      }
    });

    socket.on('rooms', function(rooms) {
    	var roomNames = [];
      for(var room in rooms) {
      	if (room) {
        	roomNames.push(room.substring(1, room.length));
      	}
      }
      $rootScope.$broadcast('RoomsEvent', roomNames);
    });

    setInterval(function() {
      socket.emit('rooms');
    }, 1000);

    var joinRoomImpl = function(room) {
      chatApp.processCommand('/join ' + room);
    };

    var sendCommandImpl = function(command) {
    	chatApp.processCommand(command);
    };

    var sendMessageImpl = function(room, message) {
    	chatApp.sendMessage(room, message);
    };

    return {
      joinRoom: joinRoomImpl,
    	sendCommand: sendCommandImpl,
    	sendMessage: sendMessageImpl
    }

  });

}());