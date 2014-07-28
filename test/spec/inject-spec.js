describe('ngservice', function() {

  describe('inject setting', function() {

    // Below, the test7Service lists  another library as its dependency.
    // The dependency is inject into the `window` object, which is then
    // used by the test7Service to do its work.
    it('should expose dependencies via the window object', function() {
      module('myTestModule7');
      inject(function(test7Service) {
        expect(test7Service(6)).to.equal(11);
      });
    });

    it('should expose dependencies via the context object', function() {
      module('myTestModule8');
      inject(function(test8Service) {
        expect(test8Service(7)).to.equal(12);
      });
    });

    it('should expose dependencies via the require function', function() {
      module('myTestModule11');
      inject(function(test11Service) {
        expect(test11Service(8)).to.equal(13);
      });
    });

  });
});
