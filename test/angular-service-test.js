'use strict';

/* Jshint direcives below */
/*global require:true */
/*global exports:true */

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

exports.angularModularize = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  defaultOptions: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/defaultOptions.js');
    var expected = grunt.file.read('test/expected/defaultOptions.js');
    test.equal(
      removeWhitespace(actual),
      removeWhitespace(expected),
      'should create a service on an existing module.');

    test.done();
  },
  withDefine: function(test) {
    test.expect(1);
    var actual = grunt.file.read('tmp/withDefine.js');
    var expected = grunt.file.read('test/expected/withDefine.js');
    test.equal(
      removeWhitespace(actual),
      removeWhitespace(expected),
      'should create a service on a newly defined module.');

    test.done();

  },
  withChoose: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/withChoose.js');
    var expected = grunt.file.read('test/expected/withChoose.js');
    test.equal(
      removeWhitespace(actual),
      removeWhitespace(expected),
      'should create a service from a single chosen property.');

    test.done();

  },
  withDependencies: function(test) {
    test.expect(1);
    var actual = grunt.file.read('tmp/withDependencies.js');
    var expected = grunt.file.read('test/expected/withDependencies.js');
    test.equal(
      removeWhitespace(actual),
      removeWhitespace(expected),
      'should inject dependencies into the service.');

    test.done();

  },
  withDefineAndDependencies: function(test) {
    test.expect(1);
    var actual = grunt.file.read('tmp/withDefineAndDependencies.js');
    var expected = grunt.file.read('test/expected/withDefineAndDependencies.js');
    test.equal(
      removeWhitespace(actual),
      removeWhitespace(expected),
      'should inject dependencies into newly created module and service.');

    test.done();
  }
};
