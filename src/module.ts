import { stub } from 'sinon';
import { DeLorean, IVehicle } from 'vehicles';

const deLorean = new DeLorean();
const idToTicketMap: Map<number, number> = new Map();

export const clearInterval = stub().callsFake((id) => {
    deLorean.cancel(id);
    idToTicketMap.delete(id);
});

export const clearTimeout = stub().callsFake(() => { // tslint:disable-line:no-empty

});

export const getVehicle = (): IVehicle => {
    return deLorean;
};

export const setInterval = stub().callsFake((func, delay) => {
    const id = deLorean.schedule(deLorean.position + delay, function funcWithScheduler() {
        idToTicketMap.set(id, deLorean.schedule(deLorean.position + delay, funcWithScheduler));

        func();
    });

    idToTicketMap.set(id, id);

    return id;
});

export const setTimeout = stub().callsFake(() => { // tslint:disable-line:no-empty

});

export const resetInterval = () => {
    deLorean.reset();
    idToTicketMap.clear();

    clearInterval.reset();
    setInterval.reset();
};
