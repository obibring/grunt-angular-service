describe('ngservice', function() {

  describe('exportStrategy setting', function() {

    /*
     * exportStrategy === 'window'
     */

    it('should return all properties added to window', function() {
      module('myTestModule1');
      inject(function(test1Service) {
        expect(test1Service.myExportedLib()).to.equal('hello world');
        expect(test1Service.mySecondProperty).to.equal(44);
      });
    });

    it('should return single property added to window', function() {
      module('myTestModule2');
      inject(function(test2Service){
        expect(test2Service()).to.equal('hello world');
      });
    });

    /*
     * exportStrategy === 'context'
     */

    it('should return all properties added to context', function() {
      module('myTestModule3');
      inject(function(test3Service) {
        expect(test3Service.myExportedLib()).to.equal('hello world');
        expect(test3Service.mySecondProperty).to.equal(44);
      });
    });

    it('should return single property added to context', function() {
      module('myTestModule4');
      inject(function(test4Service){
        expect(test4Service()).to.equal('hello world');
      });
    });

    /*
     * exportStrategy === 'node'
     */

    it('should return all properties added to module.exports', function() {
      module('myTestModule9');
      inject(function(test9Service) {
        expect(test9Service.myExportedLib()).to.equal('hello world');
        expect(test9Service.mySecondProperty).to.equal(44);
      });
    });

    it('should return single property added to module.exports', function() {
      module('myTestModule10');
      inject(function(test10Service){
        expect(test10Service()).to.equal('hello world');
      });
    });

  });
});
