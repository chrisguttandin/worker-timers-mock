import { DeLorean, type IVehicle } from 'vehicles';
import { createMockableFunction } from './mocking-implementation';

const deLorean = new DeLorean();
const intervalIdToTicketMap = new Map<number, number>();

export const clearInterval = createMockableFunction((id: number) => {
    const ticket = intervalIdToTicketMap.get(id);

    if (ticket !== undefined) {
        deLorean.cancel(ticket);
    }

    intervalIdToTicketMap.delete(id);
});

export const clearTimeout = createMockableFunction((id: number) => {
    deLorean.cancel(id);
    intervalIdToTicketMap.delete(id);
});

export const getVehicle = (): IVehicle => {
    return deLorean;
};

export const setInterval = createMockableFunction((func: Function, delay: number) => {
    const id = deLorean.schedule(deLorean.position + delay, function funcWithScheduler(): void {
        intervalIdToTicketMap.set(id, deLorean.schedule(deLorean.position + delay, funcWithScheduler));

        func();
    });

    intervalIdToTicketMap.set(id, id);

    return id;
});

export const setTimeout = createMockableFunction((func: Function, delay: number) => {
    return deLorean.schedule(deLorean.position + delay, func);
});

export const reset = () => {
    deLorean.reset();
    intervalIdToTicketMap.clear();
};
