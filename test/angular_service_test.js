'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

function removeWhitespace (str) {
  return str.replace(/\s+/g, '');
}

exports.angular_modularize = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/default_options');
    var expected = grunt.file.read('test/expected/default_options.js');
    test.equal(
      removeWhitespace(actual),
      removeWhitespace(expected),
      'should create a service on an existing module.');

    test.done();
  },
  with_define: function(test) {
    test.expect(1);
    var actual = grunt.file.read('tmp/with_define');
    var expected = grunt.file.read('test/expected/with_define.js');
    test.equal(
      removeWhitespace(actual),
      removeWhitespace(expected),
      'should create a service on a newly defined module.');

    test.done();

  },
  with_choose: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/with_choose');
    var expected = grunt.file.read('test/expected/with_choose.js');
    test.equal(
      removeWhitespace(actual),
      removeWhitespace(expected),
      'should create a service from a single chosen property.');

    test.done();

  },
  with_dependencies: function(test) {
    test.expect(1);
    var actual = grunt.file.read('tmp/with_dependencies');
    var expected = grunt.file.read('test/expected/with_dependencies.js');
    test.equal(
      removeWhitespace(actual),
      removeWhitespace(expected),
      'should inject dependencies into the service.');

    test.done();

  },
  with_define_and_dependencies: function(test) {
    test.expect(1);
    var actual = grunt.file.read('tmp/with_define_and_dependencies');
    var expected = grunt.file.read('test/expected/with_define_and_dependencies.js');
    test.equal(
      removeWhitespace(actual),
      removeWhitespace(expected),
      'should inject dependencies into newly created module and service.');

    test.done();
  }
};
