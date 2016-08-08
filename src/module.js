import { stub } from 'sinon';

var currentIntervalTime,
    lastIntervalId,
    scheduledIntervalFunctions,
    workerTimers;

currentIntervalTime = 0;
lastIntervalId = -1;
scheduledIntervalFunctions = [];

workerTimers = {
    clearInterval () {},
    clearTimeout () {},
    flushInterval (elapsedTime) {
        var scheduledIntervalFunction;

        currentIntervalTime += elapsedTime;

        while (scheduledIntervalFunctions.length && scheduledIntervalFunctions[0].nextTime <= currentIntervalTime) {
            scheduledIntervalFunction = scheduledIntervalFunctions[0];
            scheduledIntervalFunction.func();
            scheduledIntervalFunction.nextTime += scheduledIntervalFunction.delay;

            scheduledIntervalFunctions.sort((a, b) => a.nextTime - b.nextTime);
        }
    },
    setInterval () {},
    setTimeout () {}
};

stub(workerTimers, 'clearInterval', (id) => {
    var found;

    scheduledIntervalFunctions.some((scheduledIntervalFunction) => {
        found = (scheduledIntervalFunction.id === id);

        if (found) {
            scheduledIntervalFunctions.splice(scheduledIntervalFunctions.indexOf(scheduledIntervalFunction), 1);
        }

        return found;
    });
});

stub(workerTimers, 'clearTimeout', () => {

});

stub(workerTimers, 'setInterval', (func, delay) => {
    var id;

    lastIntervalId += 1;
    id = lastIntervalId;

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
