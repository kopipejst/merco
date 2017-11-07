/*global require*/
const mocha = require('mocha'),
    expect = require('chai').expect,
    sinon = require('sinon');

describe('merco module', () => {
    const merco = require('../lib/merco.js');

    it('should export 2 functions', () => {
        expect(merco.init).to.be.a('function');
        expect(merco.route).to.be.a('function');
    });
});

describe('merco init function', () => {
    const merco = require('../lib/merco.js');
    const init = merco.init();
    const req = {
        query: {
            noMerge: true
        }
    };
    const res = {
        locals: {}
    };

    const spy = sinon.spy();

    init(req, res, spy);

    it('should return a function', () => {
        expect(init).to.be.a('function');
    });

    it('should take 3 arguments', () => {
        expect(init).to.have.length.of(3);
    });

    it('should register "res.locals.js" array', () => {
        expect(res.locals.js).to.be.an('array');
        expect(res.locals.js).to.be.length.of(0);
    });

    it('should register "res.locals.getJS"', () => {
        expect(res.locals.getJS).to.be.a('function');
    });

    it('should register "res.locals.printJS"', () => {
        expect(res.locals.printJS).to.be.a('function');
    });

    it('should call the third argument once and without arguments', () => {
        expect(spy.calledOnce).to.equal(true);
        expect(spy.calledWith()).to.equal(true);
    });

    it('"getJS" should push filename to "js" array', () => {
        res.locals.getJS('/file/one.js');
        res.locals.getJS('/file/two.js');

        expect(res.locals.js).to.have.length.of(2);
        expect(res.locals.js[0]).to.equal('/file/one.js');
        expect(res.locals.js[1]).to.equal('/file/two.js');

        res.locals.getJS('/file/one.js');
        res.locals.getJS('/file/three.js');

        expect(res.locals.js).to.have.length.of(3);
        expect(res.locals.js[2]).to.equal('/file/three.js');
    });

    it('"printJS" should return script tag not merged', () => {
        const tag = res.locals.printJS();
        expect(tag).to.be.a('string');
        expect(tag).to.equal('<script src="/file/one.js" ></script><script src="/file/two.js" ></script><script src="/file/three.js" ></script>');
        res.locals.getJS('/file/four.js');
        const tag2 = res.locals.printJS();
        expect(tag2).to.equal('<script src="/file/one.js" ></script><script src="/file/two.js" ></script><script src="/file/three.js" ></script><script src="/file/four.js" ></script>');
    });

    it('"printJS" should return script tag merged', () => {
        const init = merco.init();
        const req = {
            query: {}
        };
        const res = {
            locals: {}
        };

        init(req, res, () => {});

        res.locals.getJS('/file/one.js');
        const tag = res.locals.printJS();
        expect(tag).to.equal('<script src="build/Xhvmj0dtocs2MA5jZjyzTQ%3D%3D-0.js" ></script>');
        res.locals.getJS('/file/two.js');
        const tag2 = res.locals.printJS();
        expect(tag2).to.equal('<script src="build/BmP9J%2BfQ5SS7o%2F9m7LiIbCYNdg%2B6e%2BOBM8m%2BTatcuQ4%3D-0.js" ></script>');
    });

    it('"printJS" should return script tag with async not merged', () => {
        const init = merco.init({async: true});
        const req = {
            query: {
                noMerge: true
            }
        };
        const res = {
            locals: {}
        };

        init(req, res, () => {});

        res.locals.getJS('/file/one.js');
        const tag = res.locals.printJS();
        expect(tag).to.equal('<script src="/file/one.js" async></script>');
        res.locals.getJS('/file/two.js');
        const tag2 = res.locals.printJS();
        expect(tag2).to.equal('<script src="/file/one.js" async></script><script src="/file/two.js" async></script>');
    });

    it('"printJS" should return script tag with async merged', () => {
        const init = merco.init({async: true});
        const req = {
            query: {}
        };
        const res = {
            locals: {}
        };

        init(req, res, () => {});

        res.locals.getJS('/file/one.js');
        const tag = res.locals.printJS();
        expect(tag).to.equal('<script src="build/Xhvmj0dtocs2MA5jZjyzTQ%3D%3D-0.js" async></script>');
        res.locals.getJS('/file/two.js');
        const tag2 = res.locals.printJS();
        expect(tag2).to.equal('<script src="build/BmP9J%2BfQ5SS7o%2F9m7LiIbCYNdg%2B6e%2BOBM8m%2BTatcuQ4%3D-0.js" async></script>');
    });
});
