import * as workerTimersMock from '../../src/module';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('workerTimersMock', () => {
    let vehicle;

    beforeEach(() => {
        vehicle = workerTimersMock.getVehicle();
    });

    describe('clearInterval()', () => {
        it('should not call the function after clearing the interval', () => {
            const id = workerTimersMock.setInterval(() => {
                throw new Error('this should never be called');
            }, 100);

            workerTimersMock.clearInterval(id);

            // Travel 200ms to be sure the function never gets called.
            return vehicle.travel(200);
        });

        it('should not call the function anymore after clearing the interval after the first callback', () => {
            let id = workerTimersMock.setInterval(() => {
                if (id === null) {
                    throw new Error('this should never be called');
                }

                workerTimersMock.clearInterval(id);
                id = null;
            }, 50);

            // Travel 200ms to be sure the function gets not called anymore.
            return vehicle.travel(200);
        });
    });

    describe('clearTimeout()', () => {
        it('should not call the function after clearing the timeout', () => {
            const id = workerTimersMock.setTimeout(() => {
                throw new Error('this should never be called');
            }, 100);

            workerTimersMock.clearTimeout(id);

            // Travel 200ms to be sure the function never gets called.
            return vehicle.travel(200);
        });
    });

    describe('setInterval()', () => {
        let id;

        afterEach(() => {
            workerTimersMock.clearInterval(id);
        });

        it('should return a numeric id', () => {
            id = workerTimersMock.setInterval(() => {}, 0);

            expect(id).to.be.a('number');
        });

        it('should constantly call a function with the given delay', () => {
            let before = vehicle.position;
            let calls = 0;

            function func() {
                const now = vehicle.position;
                const elapsed = now - before;

                expect(elapsed).to.equal(100);

                before = now;
                calls += 1;
            }

            id = workerTimersMock.setInterval(func, 100);

            return vehicle.travel(500).then(() => expect(calls).to.equal(5));
        });
    });

    describe('setTimeout()', () => {
        let id;

        afterEach(() => {
            workerTimersMock.clearTimeout(id);
        });

        it('should return a numeric id', () => {
            id = workerTimersMock.setTimeout(() => {}, 0);

            expect(id).to.be.a('number');
        });

        it('should postpone a function for the given delay', () => {
            const before = vehicle.position;

            let calls = 0;

            function func() {
                const elapsed = vehicle.position - before;

                expect(elapsed).to.equal(100);

                calls += 1;
            }

            id = workerTimersMock.setTimeout(func, 100);

            return vehicle.travel(500).then(() => expect(calls).to.equal(1));
        });
    });
});
