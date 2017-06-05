import { SinonStub, stub } from 'sinon';
import { DeLorean } from 'vehicles';

const deLorean = new DeLorean();
const idToTicketMap = new Map();

const workerTimers = {
    clearInterval () {}, // tslint:disable-line:no-empty
    clearTimeout () {}, // tslint:disable-line:no-empty
    flushInterval (elapsedTime: number) {
        deLorean.travel(elapsedTime);
    },
    resetInterval () {
        deLorean.reset();
        idToTicketMap.clear();

        (<SinonStub> workerTimers.clearInterval).reset();
        (<SinonStub> workerTimers.setInterval).reset();
    },
    setInterval () {}, // tslint:disable-line:no-empty
    setTimeout () {} // tslint:disable-line:no-empty
};

stub(workerTimers, 'clearInterval').callsFake((id) => {
    deLorean.cancel(id);
    idToTicketMap.delete(id);
});

stub(workerTimers, 'clearTimeout').callsFake(() => { // tslint:disable-line:no-empty

});

stub(workerTimers, 'setInterval').callsFake((func, delay) => {
    const id = deLorean.schedule(deLorean.position + delay, function funcWithScheduler() {
        idToTicketMap.set(id, deLorean.schedule(deLorean.position + delay, funcWithScheduler));

        func();
    });

    idToTicketMap.set(id, id);

    return id;
});

stub(workerTimers, 'setTimeout').callsFake(() => { // tslint:disable-line:no-empty

});

export default workerTimers;
