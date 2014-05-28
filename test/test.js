/*global require*/
var mocha = require('mocha'),
    expect = require('chai').expect;

describe('merco', function () {
    var merco = require('../lib/merco.js');

    describe('lengths', function () {
        it('expect to not be undefined', function () {
            expect('a').not.to.be.an('undefined');
        });

    });

});
