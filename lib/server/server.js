/*
 * chat: server/server.js
 * Configuration for the chat server module
 *
 * Copyright (c) 2013 Jon Brule
 * Licensed under the MIT license.
 */
(function() {
	'use strict';

  // module dependencies
  var Hapi = require('hapi');
  var appcfg = require("config").CHAT;
  var plugins = require('./plugins');
  var routes = require('./routes');

  // configure http server
  var hapicfg = {
    views: {
      engines: { jade: 'jade' },
      path: __dirname + '/../../views',
      compileOptions: {
        pretty: true
      }
    }
  };
  var serverPort = process.env.PORT || appcfg.serverPort;
  var server = new Hapi.Server('0.0.0.0', serverPort, hapicfg);
  plugins.configureLout(server);
  server.addRoutes(routes);

  // export application configuration
  module.exports = server

}());