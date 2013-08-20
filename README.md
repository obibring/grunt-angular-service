# grunt-angular-service
> Convert libraries to Angular services as part of your workflow.

Use `grunt-angular-service` to create Angular services from JavaScript libraries
as part of your worklflow.


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


#### How it works
Ngservice wraps JavaScript code in a call to Angular's `factory` method, thereby
creating a service you can request via dependency injection.

The value returned by the ```factory``` function is determined as follows:

  1. If the library adds a single property onto its execution context (```this```), that
  value is the service.

### Overview
In your project's Gruntfile, add a section named `ngservice` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  ngservice: {
    name: 'myLibAsService',    // Name of dependency to create
    module: 'myLibModule',     // Name of Module service belongs to
    defineModule: true,              // Define the module above?
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

### Settings

#### module
Type: `String`

The name of the module to which the service is added.

#### service
Type: `String`

The name of the service being created.

#### defineModule
Type: `Boolean` Default Value: ```false```

Whether to define the module onto which the service is declared.

#### choose
Type: `String`

Declare a specific property to export. Use this if your library exports multiple properties
and you're only interested in one of them.


#### dependencies
Type: ```Array``` Default Value: ```null```

A list of dependencies passed to the ```factory``` method and available to wrapped libraries via ```this```.

### Usage Examples

#### Generate a Angular Service from an Existing JavaScript Library
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

#### Generate a Service From an Existing JavaScript Library that has Dependencies
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
