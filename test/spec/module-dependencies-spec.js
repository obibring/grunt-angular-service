describe('ngservice', function() {

  describe('moduleDependencies setting', function() {

    it('should expose dependencies from other modules via the window object', function() {
      module('myDynamicModule');
      inject(function(test9Service) {
        expect(test9Service(6)).to.equal(11);
      });
    });

    it('should expose dependencies from other modules via the context object', function() {
      module('myDynamicModule2');
      inject(function(test10Service) {
        expect(test10Service(7)).to.equal(12);
      });
    });

    it('should expose dependencies from other modules via the require function', function() {
      module('myDynamicModule3');
      inject(function(test13Service) {
        expect(test13Service(7)).to.equal(12);
      });
    });

  });
});
