'use strict';

var spy = require('sinon').spy,
    workerTimersMock = require('../../src/module.js');

describe('workerTimersMock', function () {

    describe('flush()', function () {

        var func;

        beforeEach(function () {
            func = spy();
        });

        it('should not call the given function', function () {
            workerTimersMock.setInterval(func, 300);

            workerTimersMock.flushInterval(299);

            expect(func).to.have.not.been.called;
        });

        it('should call the given function', function () {
            workerTimersMock.setInterval(func, 300);

            workerTimersMock.flushInterval(300);

            expect(func).to.have.been.calledOnce;
        });

        it('should call the given function twice', function () {
            workerTimersMock.setInterval(func, 300);

            workerTimersMock.flushInterval(600);

            expect(func).to.have.been.calledTwice;
        });

    });

});
