'use strict';

describe('ngStorage', function () {
    var expect = chai.expect;

    beforeEach(module('ngStorage'));

    it('should contain a $localStorage service', inject(function(
        $localStorage
    ){
        expect($localStorage).not.to.equal(null);
    }));
});
