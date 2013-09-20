/*
 * chat: server/routes.js
 * Route definitions for the chat server module
 *
 * Copyright (c) 2013 Jon Brule
 * Licensed under the MIT license.
 */


'use strict';

// module dependencies
require('pkginfo')(module);
var i18n = require('i18next');

// configure i18n
i18n.init({
  lng: 'en-US',
  fallbackLng: 'en-US',
  debug: false,
  ns: 'messages',
  resGetPath: 'i18n/__lng__/__ns__.json' 
});

// configure metadata passed to views
var viewMetadata = JSON.parse(JSON.stringify(module.exports));
viewMetadata.env = process.env.NODE_ENV || 'DEV';
viewMetadata.t = i18n.t;

// main page handler
var rootHandler = function (request) {
  request.reply.view('index', viewMetadata);
};

// client view handler
var viewHandler = function (request) {
  request.reply.view('client/' + request.params.view, viewMetadata);
};

// route definitions
module.exports = [
  { method: 'GET', path: '/', config: { handler: rootHandler } },
  { method: 'GET', path: '/view/{view}', config: { handler: viewHandler } },
  { method: 'GET', path: '/{path*}', config: { 
    handler: {  directory: { path: './public', listing: false, index: false } } 
  }}
];
