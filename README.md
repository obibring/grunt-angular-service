# grunt-angular-service
> Convert libraries to Angular services as part of your workflow.

Use `grunt-angular-service` to wrap non-Angular JS code in Angular service
definitions as part of your worklflow.


## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out
the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how
to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use
Grunt plugins. Once you're familiar with that process, you may install this plugin
with this command:

```shell
npm install grunt-angular-service --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this
line of JavaScript:

```js
grunt.loadNpmTasks('grunt-angular-service');
```

## The "ngservice" task
`Ngservice` wraps JavaScript code in a call to one of Angular's various provider
convenience methods (`factory`, `service`, `constant`, `value`),
thereby creating code you can inject via Angular's dependency
injection.


### How it Works
  1. You provide `ngservice` a target library. This is the library whose
  functionality you want to inject using Angular dependency injection.
  2. `Ngservice` executes the target library's code.
  3. Using the `exportStrategy` option you set in your `ngservice`
  grunt task, `ngservice` determines what to return from the `factory`,
  `service`, `constant`, or `value` provider it creates for you.

### Use Cases
  1. You aren't using a script loader, and want angular style DI for all your
  non-Angular libraries.
  2. You have a node library you want to use client side with angular.

There are probably many more use cases. If any come to mind, please share.

## Overview
In your project's Gruntfile, add a section named `ngservice` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  ngservice: {
    name: 'myLibService',    // First argument passed to angular.factory(), angular.service(), etc.
    module: 'myLibModule',     // Name of Module the service is being added to.
    defineModule: true,        // Define a new module?
    files: {
        'my_library_as_angular_service.js': 'my_library.js'
    }
  },
})
```

Will produce the file `my_library_as_angular_service.js`:

```js
angular.module('myLibModule', []).factory('myLibAsService', function() {
  // Your library here.
});
```

## Options

### exportStrategy
Type: `String`

This

### name
Type: `String`

The name of the service being created.

### module
Type: `String`

The name of the module to which the service is added.

### defineModule
Type: `Boolean` Default Value: ```false```

Whether to define the module.

### choose
Type: `String`

Declare a specific property to export. Use this if your library exports multiple properties
and you're only interested in one of them.

### dependencies
Type: ```Array``` Default Value: ```null```

A list of dependencies made available to libraries via ```this```.

## Usage Examples

### Generate a Angular Service from an Existing JavaScript Library
In this example, underscore.js is ported to an angular service.
```js
grunt.initConfig({
  ngservice: {
    module: "myModule",
    name: "_",
    files: {
      'services/underscore_service.js': 'path/to/underscore.js',
    },
  },
})
```

### Generate a Service From an Existing JavaScript Library that has Dependencies
In this contrived example, underscore.js and Backbone.js are both converted to angular services, with the former provided as a dependency to the latter.

```js
grunt.initConfig({
  ngservice: {
    underscore: {
      name: '_',
      module: 'myModule',
      files: {
        'services/underscore_service.js': 'path/to/underscore.js',
      }
    },
    backbone: {
      name: 'Backbone',
      module: 'myModule',
      dependencies: ['_'],
      files: {
        'services/backbone_service.js': 'path/to/backbone.js',
      }
    }
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
The MIT License

Copyright (c) 2013 Orr Bibring

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
