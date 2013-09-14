/*
 * chat: server/plugins.js
 * Plugins for the chat server module
 *
 * Copyright (c) 2013 Jon Brule
 * Licensed under the MIT license.
 */
(function() {
	'use strict';

  // module dependencies
  var appcfg = require("config").WEATHER;
  var _ = require("underscore.string");

  // configure RESTful API docs endpoint
  exports.configureLout = function(server) {
    server.pack.require({
      lout : {
        endpoint : '/docs'
      }
    }, function(err) {
      handleError("lout", server, err);
    });
  };

  // configure debugging server
  exports.configureTv = function(server) {
    var debugPort = process.env.DEBUG_PORT || appcfg.debugPort;
    var tvOptions = {
      webSocketPort : debugPort,
      debugEndpoint : '/debug/console',
      queryKey : 'debug'
    };
    server.pack.require('tv', tvOptions, function(err) {
      handleError("tv", server, err);
    });
  };

  var handleError = function(plugin, server, err) {
      var msg, format = "Plugin Load %s - %s";
      if (err) {
        msg = _.sprintf(format + " : %s", "Failure", plugin, err.message);
        console.error(msg);
        server.log([ 'error', 'tv' ], msg);
      } else {
        msg = _.sprintf(format, "Success", plugin);
        console.log(msg);
        server.log([ 'info', 'tv' ], msg);
      }
  }

}());