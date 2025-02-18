import { stub, type SinonStub } from 'sinon';
import { DeLorean, type IVehicle } from 'vehicles';

const deLorean = new DeLorean();
const intervalIdToTicketMap = new Map<number, number>();

export const clearInterval = stub().callsFake((...args) => {
    /*
     * @todo The current version of @types/sinon (v5.0.6) defines this function as one without parameters. Therefore this clunky
     * destructuring is needed to keep TypeScript happy.
     */
    const [id] = args as [number];
    const ticket = intervalIdToTicketMap.get(id);

    if (ticket !== undefined) {
        deLorean.cancel(ticket);
    }

    intervalIdToTicketMap.delete(id);
});

export const clearTimeout: SinonStub = stub().callsFake((...args) => {
    /*
     * @todo The current version of @types/sinon (v5.0.6) defines this function as one without parameters. Therefore this clunky
     * destructuring is needed to keep TypeScript happy.
     */
    const [id] = args as [number];

    deLorean.cancel(id);
    intervalIdToTicketMap.delete(id);
});

export const getVehicle = (): IVehicle => {
    return deLorean;
};

export const setInterval: SinonStub = stub().callsFake((...args) => {
    /*
     * @todo The current version of @types/sinon (v5.0.6) defines this function as one without parameters. Therefore this clunky
     * destructuring is needed to keep TypeScript happy.
     */
    const [func, delay] = args as [Function, number];
    const id = deLorean.schedule(deLorean.position + delay, function funcWithScheduler(): void {
        intervalIdToTicketMap.set(id, deLorean.schedule(deLorean.position + delay, funcWithScheduler));

        func();
    });

    intervalIdToTicketMap.set(id, id);

    return id;
});

export const setTimeout: SinonStub = stub().callsFake((...args) => {
    /*
     * @todo The current version of @types/sinon (v5.0.6) defines this function as one without parameters. Therefore this clunky
     * destructuring is needed to keep TypeScript happy.
     */
    const [func, delay] = args as [Function, number];

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
