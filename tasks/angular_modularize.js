/*
 * grunt-angular-modularize
 * https://github.com/obibring/grunt-angular-modularize
 *
 * Copyright (c) 2013 Orr Bibring
 * Licensed under the MIT license.
 */

 /*
 * 1. Read libraries.
 * 2. Check if libraries interact with global namespace (warn / throw).
 * 3.
 */

'use strict';
_ = require('underscore');

// Template that wraps libraries in angular module definition.
var template = _.template("(function(angular){angular.module('<%= module %>')" +
  ".factory('<%= factory %>', function() {" +
  "  function temp() { " +
  "    <%= src %> " +
  "  } " +
  "  var lib = new temp(); " +
  "  var properties = [];
  "  for (var key in lib) if (lib.hasOwnProperty(key)) properties.push(key); " +
  "  if (properties.length === 1)" +
  "    return lib[properties.pop()]; " +
  "  else " +
  "    return lib; " +
  "})(window.angular)");

module.exports = function(grunt) {

  var warn = (function (message) {
    grunt.log.warn(this.nameArgs + ": " + message);
  }).bind(this);

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask(
    'angular_modularize',
    'Convert Javascript libraries to AngularJS modules', function() {

      // Merge task-specific and/or target-specific options with these defaults.
      var options = this.options({
        punctuation: '.',
        separator: ', '
      });

      // Must provide name of angular module to be created.
      this.requiresConfig('module');
      this.requiresConfig('factory');

      var module = this.options.module;
      var factory = this.options.factory;

      // Iterate over all specified file groups.
      this.files.forEach(function(f) {
        // Concat specified files.
        var src = f.src.filter(function(filepath) {
          // Warn on and remove invalid source files (if nonull was set).
          if (!grunt.file.exists(filepath)) {
            warn('Source file "' + filepath + '" not found.');
            return false;
          } else {
            return true;
          }
        }).map(function(filepath) {
          // Read file source.
          return grunt.file.read(filepath);
        }).forEach(function(srcString) {
          var angularized = template({
            src: srcString,
            module: module,
            factory: factory
          });

          // Write the destination file.
          grunt.file.write(f.dest, angularized);

          // Print a success message.
          grunt.log.writeln('File "' + f.dest + '" created.');
        });

    });
  });

};
