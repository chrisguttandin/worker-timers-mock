import { SinonStub, stub } from 'sinon';

let currentIntervalTime = 0;
let lastIntervalId = -1;

const scheduledIntervalFunctions: { delay: number, func: Function, id: number, nextTime: number }[] = [];

const workerTimers = {
    clearInterval () {}, // tslint:disable-line:no-empty
    clearTimeout () {}, // tslint:disable-line:no-empty
    flushInterval (elapsedTime: number) {
        currentIntervalTime += elapsedTime;

        while (scheduledIntervalFunctions.length && scheduledIntervalFunctions[0].nextTime <= currentIntervalTime) {
            const scheduledIntervalFunction = scheduledIntervalFunctions[0];

            scheduledIntervalFunction.func();
            scheduledIntervalFunction.nextTime += scheduledIntervalFunction.delay;

            scheduledIntervalFunctions.sort((a, b) => a.nextTime - b.nextTime);
        }
    },
    resetInterval () {
        currentIntervalTime = 0;
        lastIntervalId = -1;
        scheduledIntervalFunctions.length = 0;

        (<SinonStub> workerTimers.clearInterval).reset();
        (<SinonStub> workerTimers.setInterval).reset();
    },
    setInterval () {}, // tslint:disable-line:no-empty
    setTimeout () {} // tslint:disable-line:no-empty
};

stub(workerTimers, 'clearInterval').callsFake((id) => {
    scheduledIntervalFunctions.some((scheduledIntervalFunction) => {
        const found = (scheduledIntervalFunction.id === id);

        if (found) {
            scheduledIntervalFunctions.splice(scheduledIntervalFunctions.indexOf(scheduledIntervalFunction), 1);
        }

        return found;
    });
});

stub(workerTimers, 'clearTimeout').callsFake(() => { // tslint:disable-line:no-empty

});

stub(workerTimers, 'setInterval').callsFake((func, delay) => {
    lastIntervalId += 1;

    const id = lastIntervalId;

    scheduledIntervalFunctions.push({
        delay,
        func,
        id,
        nextTime: currentIntervalTime + delay
    });

    scheduledIntervalFunctions.sort((a, b) => a.nextTime - b.nextTime);

    return id;
});

stub(workerTimers, 'setTimeout').callsFake(() => { // tslint:disable-line:no-empty

});

export default workerTimers;
