/*
 * grunt-angular-service
 * https://github.com/obibring/grunt-angular-service
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
var _ = require('underscore');

// Template that wraps JavaScript in angular factory definition.
var template = _.template("(function(angular) {"+
  "  angular.module('<%= module %>')" +
  "    .factory('<%= factory %>', function() {" +
  "      function temp() {" +
  "        <%= src %>" +
  "      }" +
  "      var lib = new temp();" +
  "      var properties = [];" +
  "      for (var key in lib) { " +
  "        if (lib.hasOwnProperty(key)) properties.push(key);" +
  "      }" +
  "      if (properties.length === 1) {" +
  "        return lib[properties.pop()];" +
  "       } else {" +
  "         return lib;" +
  "       } " +
  "     });" +
  "  })(window.angular);");

module.exports = function(grunt) {


  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('ngservice',
    'Generate AngularJS services from JavaScript libraries', function() {

        var warn = function (message) {
          grunt.log.warn(this.name + ": " + message);
        }.bind(this);

        var log = function (message) {
          grunt.log.writeln(this.name + ": " + message);
        }.bind(this);

      // Merge task-specific and/or target-specific options with these defaults.
      var options = this.options({
        punctuation: '.',
        separator: ', '
      });

      // Must provide name of angular module to be created.
      //this.requiresConfig(this.name+'.module');
      //this.requiresConfig(this.name+'.factory');

      var module = this.data.module;
      var factory = this.data.factory;

      console.log(this.files);

      // Iterate over all specified file groups.
      this.files.forEach(function(f) {
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
          var service = template({
            src: srcString,
            module: module,
            factory: factory
          });

          // Write the destination file.
          grunt.file.write(f.dest, service);

          // Print a success message.
          log('File "' + f.dest + '" created.');
        });

    });
  });

};
