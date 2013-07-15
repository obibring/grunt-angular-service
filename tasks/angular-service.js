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

var quoteWrap = function (dep) {
  // Wrap dependency in quotes.
  return "'" + dep + "'";
};

// Template that wraps JavaScript in angular factory definition.
//
var makeTemplate = function(define, dependencies) {

  var deps = dependencies || [];
  var defineStr = define ? ', [' + deps.map(quoteWrap).join(', ') + ']' : '';
  var srvcStr = deps.length ? deps.map(quoteWrap).join(', ') + ', ' : '';

  var template =
    "(function(angular) {"+
    "  angular.module('<%= module %>'" + defineStr +  ")" +
    "    .factory('<%= service %>', [" + srvcStr + "function("+ deps.join(', ') +") {" +
    "      function temp() {" +
    "        <%= src %>" +
    "      }";

  // Above, `src` may have dependencies. Thus, prior to executing `temp`
  // create an execution context injected with these dependencies.
  template += " var context = {}; ";

  // Keep track of which dependencies were injected into `context`.
  template += " var injected = {}; ";

  deps.forEach(function(dep){
    template += "context['" + dep + "'] = " + dep + ";";
    template += "injected['" + dep + "'] = true;";
  });

  template +=
    "      temp.call(context);" +
    // Iterate over properties of `context`, comparing each property to the
    // properties injected above. If only a single property exists that
    // wasn't injected, this sole property is returned.
    "      var addedProps = [];" +
    "      for (var prop in context) { " +
    "        if (context.hasOwnProperty(prop) && !injected.hasOwnProperty(prop)) { " +
    "           addedProps.push(prop);" +
    "        } " +
    "      }" +
    "      if (addedProps.length === 1) {" +
    "        return context[addedProps.pop()];" +
    "       } else {" +
    // `src` added more than a single property into `context`. Make no
    // assumptions and return the entire `context` object.
    "         return context;" +
    "       } " +
    "     }]);" +
    "  })(window.angular);";

  return template;
};

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

        var fatal = function (message) {
          grunt.fatal(this.name + ": " + message);
        }.bind(this);

      var data = this.data;

      // Determine validity of `module` option.
      if (!_.has(data, 'module') || !_.isString(data.module)) {
        fatal('Invalid `module` option.');
      }

      // Determine validity of `service` option.
      if (!_.has(data, 'service') || !_.isString(data.service)) {
        fatal('Invalid `service` option.');
      }

      // Determine validity of `define` option.
      if (_.has(data, 'define') && !_.isBoolean(data.define)) {
        fatal('Invalid `define` option.');
      }

      var module  = data.module;                  // Name of module to be written.
      var dependencies = data.dependencies || []; // Service dependencies.
      var define  = data.define || false;         // Whether to define the module.
      var service = data.service;                 // Name of service to be written.

      var sources = [];

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
          sources.push(srcString);
        });

        // If sources is empty, die.
        if (sources.length < 1) {
          fatal('No source files provided.');
        }

        var template = makeTemplate(define, dependencies);

        // Write the destination file.
        grunt.file.write(f.dest, _.template(template, {
          src: sources.join("\n"),
          module: module,
          service: service
        }));

        // Print a success message.
        log('File "' + f.dest + '" created.');

    });
  });

};
