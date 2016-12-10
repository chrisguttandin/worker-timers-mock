import { spy } from 'sinon';
import workerTimersMock from '../../src/module';

describe('workerTimersMock', () => {

    describe('flush()', () => {

        let func;

        beforeEach(() => {
            func = spy();
        });

        it('should not call the given function', () => {
            workerTimersMock.setInterval(func, 300);

            workerTimersMock.flushInterval(299);

            expect(func).to.have.not.been.called;
        });

        it('should call the given function', () => {
            workerTimersMock.setInterval(func, 300);

            workerTimersMock.flushInterval(300);

            expect(func).to.have.been.calledOnce;
        });

        it('should call the given function twice', () => {
            workerTimersMock.setInterval(func, 300);

            workerTimersMock.flushInterval(600);

            expect(func).to.have.been.calledTwice;
        });

    });

});
