import * as workerTimersMock from '../../src/module';
import { spy } from 'sinon';

describe('workerTimersMock', () => {

    describe('flush()', () => {

        let func;
        let vehicle;

        beforeEach(() => {
            func = spy();
            vehicle = workerTimersMock.getVehicle();
        });

        it('should not call the given function', () => {
            workerTimersMock.setInterval(func, 300);

            vehicle.travel(299);

            expect(func).to.have.not.been.called;
        });

        it('should call the given function', () => {
            workerTimersMock.setInterval(func, 300);

            vehicle.travel(300);

            expect(func).to.have.been.calledOnce;
        });

        it('should call the given function twice', () => {
            workerTimersMock.setInterval(func, 300);

            vehicle.travel(600);

            expect(func).to.have.been.calledTwice;
        });

    });

});
