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
var _ = require('underscore');

// Template that wraps libraries in angular factory definition.
var template = _.template("(function(angular) {\n"+
  "  angular.module('<%= module %>')\n\t" +
  "    .factory('<%= factory %>', function() {\n\t\t" +
  "      function temp() {\n\t\t\t" +
  "        <%= src %>\n\t\t\t" +
  "      }\n\t\t" +
  "      var lib = new temp();\n" +
  "      var properties = [];\n" +
  "      for (var key in lib) { \n" +
  "        if (lib.hasOwnProperty(key)) properties.push(key);\n" +
  "      }\n" +
  "      if (properties.length === 1) {\n" +
  "        return lib[properties.pop()];\n" +
  "       } else {\n" +
  "         return lib;\n" +
  "       } " +
  "     });\n" +
  "  })(window.angular);");

module.exports = function(grunt) {


  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask(
    'angular_modularize',
    'Convert Javascript libraries to AngularJS modules', function() {

        var warn = function (message) {
          grunt.log.warn(this.name + ": " + message);
        };

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
          log('File "' + f.dest + '" created.');
        });

    });
  });

};
