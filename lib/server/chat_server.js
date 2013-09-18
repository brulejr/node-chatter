/*
 * chat: server/chat_server.js
 * WebSocket server for the chat server module
 *
 * Copyright (c) 2013 Jon Brule
 * Licensed under the MIT license.
 */

(function() {
  'use strict';

  // module dependencies
  var SocketIO = require('socket.io'), io;
  var guestNumber = 1, 
      nickNames = {}, 
      namesUsed = [], 
      currentRoom = {};

  exports.listen = function(server) {
    io = SocketIO.listen(server);
    io.set('log level', 1);

    io.sockets.on('connection', function (socket) {
      guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
      joinRoom(socket, 'Lobby');

      handleMessageBroadcasting(socket, nickNames);
      handleNameChangeAttempts(socket, nickNames, namesUsed);
      handleRoomJoining(socket);

      socket.on('rooms', function() {
        socket.emit('rooms', io.sockets.manager.rooms);
      });

      handleClientDisconnection(socket, nickNames, namesUsed);
    });
  };

  function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    var name = 'Guest' + guestNumber;
    nickNames[socket.id] = { name: name, color: createRandomColor() };
    socket.emit('nameResult', {
      success: true,
      name: name
    });
    namesUsed.push(name);
    return guestNumber + 1;
  }

  function createRandomColor() {
    var color = "";
    while (!color) {
      var digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
      for (var i = 0; i < 6; i++) {
        color += digits[Math.floor((Math.random()*16))];
      }
      var r = parseInt(color.substr(0,2),16);
      var g = parseInt(color.substr(2,2),16);
      var b = parseInt(color.substr(4,2),16);
      var yiq = ((r*299)+(g*587)+(b*114))/1000;
      if (yiq >= 128) {
        color = "";
      }
    }
    return color;
  };

  function joinRoom(socket, room) {
    socket.join(room);
    currentRoom[socket.id] = room;
    socket.emit('joinResult', {room: room});
    socket.broadcast.to(room).emit('message', {
      text: nickNames[socket.id].name + ' has joined ' + room + '.',
      type: "system",
      color: nickNames[socket.id].color
    });

    var usersInRoom = io.sockets.clients(room);
    if (usersInRoom.length > 1) {
      var usersInRoomSummary = 'Users currently in ' + room + ': ';
      for (var index in usersInRoom) {
        var userSocketId = usersInRoom[index].id;
        if (userSocketId !== socket.id) {
          if (index > 0) {
            usersInRoomSummary += ', ';
          }
          usersInRoomSummary += nickNames[userSocketId].name;
        }
      }
      usersInRoomSummary += '.';
      socket.emit('message', { text: usersInRoomSummary, type: "system" });
    }
  }

  function handleMessageBroadcasting(socket, nickNames) {
    socket.on('message', function (message) {
      socket.broadcast.to(message.room).emit('message', {
        text: nickNames[socket.id].name + ': ' + message.text,
        type: "user",
        color: nickNames[socket.id].color
      });
    });
  }

  function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    socket.on('nameAttempt', function(name) {
      if (name.indexOf('Guest') === 0) {
        socket.emit('nameResult', {
          success: false,
          message: 'Names cannot begin with "Guest".',
          type: "system"
        });
      } else {
        if (namesUsed.indexOf(name) === -1) {
          var previousName = nickNames[socket.id].name;
          var previousNameIndex = namesUsed.indexOf(previousName);
          namesUsed.push(name);
          nickNames[socket.id].name = name;
          delete namesUsed[previousNameIndex];
          socket.emit('nameResult', {
            success: true,
            name: name
          });
          socket.broadcast.to(currentRoom[socket.id]).emit('message', {
            text: previousName + ' is now known as ' + name + '.',
            type: "system",
            color: nickNames[socket.id].color
          });
        } else {
          socket.emit('nameResult', {
            success: false,
            message: 'That name is already in use.',
            type: "system"
          });
        }
      }
    });
  }

  function handleRoomJoining(socket) {
    socket.on('join', function(room) {
      socket.leave(currentRoom[socket.id]);
      joinRoom(socket, room.newRoom);
    });
  }

  function handleClientDisconnection(socket, nickNames, namesUsed) {
    socket.on('disconnect', function() {
      var nameIndex = namesUsed.indexOf(nickNames[socket.id].name);
      delete namesUsed[nameIndex];
      delete nickNames[socket.id];
    });
  }

}());