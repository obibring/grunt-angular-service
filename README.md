# grunt-angular-service

> Generate AngularJS services from JavaScript libraries.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-angular-service --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-angular-service');
```

## The "ngservice" task

### Overview
In your project's Gruntfile, add a section named `ngservice` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  ngservice: {
    service: 'someService',
    module: 'someModule',
    define: false,
    your_target: {
      // Target-specific file lists and/or options go here.
    }
  },
})
```

### Options

#### module
Type: `String`

The name of the module into which the service is defined.

#### service
Type: `String`

The name of the service to be added to the module.

#### define
Type: `Boolean` Default Value: ```false```

A boolean value indicating whether to define the module.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  ngservice: {
    module: "somePrededinedModule",
    service: "MyLibrary",
    files: {
      'dest/angularized_library.js': 'library.js',
    },
  },
})
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  ngservice: {
    module: 'someNewModule',
    define: true,
    service: 'someServiceAddedToNewModule',
    files: {
      'dest/angularized_library.js': 'library.js',
    },
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
