import { stub } from 'sinon';

let currentIntervalTime = 0;
let lastIntervalId = -1;

const scheduledIntervalFunctions = [];

const workerTimers = {
    clearInterval () {},
    clearTimeout () {},
    flushInterval (elapsedTime) {
        currentIntervalTime += elapsedTime;

        while (scheduledIntervalFunctions.length && scheduledIntervalFunctions[0].nextTime <= currentIntervalTime) {
            const scheduledIntervalFunction = scheduledIntervalFunctions[0];

            scheduledIntervalFunction.func();
            scheduledIntervalFunction.nextTime += scheduledIntervalFunction.delay;

            scheduledIntervalFunctions.sort((a, b) => a.nextTime - b.nextTime);
        }
    },
    setInterval () {},
    setTimeout () {}
};

stub(workerTimers, 'clearInterval', (id) => {
    scheduledIntervalFunctions.some((scheduledIntervalFunction) => {
        const found = (scheduledIntervalFunction.id === id);

        if (found) {
            scheduledIntervalFunctions.splice(scheduledIntervalFunctions.indexOf(scheduledIntervalFunction), 1);
        }

        return found;
    });
});

stub(workerTimers, 'clearTimeout', () => {

});

stub(workerTimers, 'setInterval', (func, delay) => {
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

stub(workerTimers, 'setTimeout', () => {

});

workerTimers.resetInterval = () => {
    currentIntervalTime = 0;
    lastIntervalId = -1;
    scheduledIntervalFunctions.length = 0;

    workerTimers.clearInterval.reset();
    workerTimers.setInterval.reset();
};

export default workerTimers;
