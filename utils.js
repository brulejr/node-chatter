/*
 * chat: utils.js
 * Global utilities the chat application
 *
 * Copyright (c) 2013 Jon Brule
 * Licensed under the MIT license.
 */
(function() {
  'use strict';

  GLOBAL.requireLib = (function(root) {
    return function(resource) {
      return require(root + "/lib/" + resource);
    }
  })(__dirname);

}());