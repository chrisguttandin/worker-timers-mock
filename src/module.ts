import { SinonStub, stub } from 'sinon';
import { DeLorean, IVehicle } from 'vehicles';

const deLorean = new DeLorean();
const intervalIdToTicketMap: Map<number, number> = new Map();

export const clearInterval: SinonStub = stub().callsFake((id) => {
    const ticket = intervalIdToTicketMap.get(id);

    if (ticket !== undefined) {
        deLorean.cancel(ticket);
    }

    intervalIdToTicketMap.delete(id);
});

export const clearTimeout: SinonStub = stub().callsFake((id) => {
    deLorean.cancel(id);
    intervalIdToTicketMap.delete(id);
});

export const getVehicle = (): IVehicle => {
    return deLorean;
};

export const setInterval: SinonStub = stub().callsFake((func, delay) => {
    const id = deLorean.schedule(deLorean.position + delay, function funcWithScheduler () {
        intervalIdToTicketMap.set(id, deLorean.schedule(deLorean.position + delay, funcWithScheduler));

        func();
    });

    intervalIdToTicketMap.set(id, id);

    return id;
});

export const setTimeout: SinonStub = stub().callsFake((func, delay) => {
    return deLorean.schedule(deLorean.position + delay, func);
});

export const reset = () => {
    deLorean.reset();
    intervalIdToTicketMap.clear();

    clearInterval.resetHistory();
    clearTimeout.resetHistory();
    setInterval.resetHistory();
    setTimeout.resetHistory();
};
