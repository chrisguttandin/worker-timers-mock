'use strict';

var currentIntervalTime,
    currentTimeoutTime,
    lastIntervalId,
    lastTimeoutId,
    scheduledIntervalFunctions,
    scheduledTimeoutFunctions,
    sinon = require('sinon'),
    workerTimers;

currentIntervalTime = 0;
currentTimeoutTime = 0;
lastIntervalId = -1;
lastTimeoutId = -1;
scheduledIntervalFunctions = [];
scheduledTimeoutFunctions = [];

workerTimers = {
    clearInterval: function () {},
    clearTimeout: function () {},
    flushInterval: function (elapsedTime) {
        var scheduledIntervalFunction;

        currentIntervalTime += elapsedTime;

        while (scheduledIntervalFunctions.length && scheduledIntervalFunctions[0].nextTime <= currentIntervalTime) {
            scheduledIntervalFunction = scheduledIntervalFunctions[0];
            scheduledIntervalFunction.func();
            scheduledIntervalFunction.nextTime += scheduledIntervalFunction.delay;

            scheduledIntervalFunctions.sort(function(a, b) {
                return a.nextTime - b.nextTime;
            });
        }
    },
    setInterval: function () {},
    setTimeout: function () {}
};

sinon.stub(workerTimers, 'clearInterval', function (id) {
    var found;

    scheduledIntervalFunctions.some(function (scheduledIntervalFunction) {
        found = (scheduledIntervalFunction.id === id);

        if (found) {
            scheduledIntervalFunctions.splice(scheduledIntervalFunctions.indexOf(scheduledIntervalFunction), 1);
        }

        return found;
    });
});

sinon.stub(workerTimers, 'clearTimeout', function () {

});

sinon.stub(workerTimers, 'setInterval', function (func, delay) {
    var id;

    lastIntervalId += 1;
    id = lastIntervalId;

    scheduledIntervalFunctions.push({
        delay: delay,
        func: func,
        id: id,
        nextTime: currentIntervalTime + delay
    });

    scheduledIntervalFunctions.sort(function(a, b) {
        return a.nextTime - b.nextTime;
    });

    return id;
});

sinon.stub(workerTimers, 'setTimeout', function () {

});

workerTimers.resetInterval = function () {
    currentIntervalTime = 0;
    lastIntervalId = -1;
    scheduledIntervalFunctions.length = 0;

    workerTimers.clearInterval.reset();
    workerTimers.setInterval.reset();
};

module.exports = workerTimers;
