describe('ngservice', function() {

  describe('choose setting', function() {

    it('should return the specific property from window', function() {
      module('myTestModule5');
      inject(function(test5Service) {
        expect(test5Service()).to.equal('hello world');
      });
    });

    it('should return the specific property from context', function() {
      module('myTestModule6');
      inject(function(test6Service) {
        expect(test6Service()).to.equal('hello world');
      });
    });

    it('should return the specific property from module.exports', function() {
      module('myTestModule12');
      inject(function(test12Service) {
        expect(test12Service()).to.equal('hello world');
      });
    });

  });
});
