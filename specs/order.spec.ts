import { expect, test, describe } from "bun:test";
import { beforeEach, afterEach } from "bun:test";

import { Order } from "./notebook/order.aggregate";
import { PlaceOrder } from "./notebook/commands/place-order";
import { OrderPlaced } from "./notebook/events/order-placed.event";

import { ShipOrder } from "./notebook/commands/ship-order";
import { OrderShipped, OrderShippedFailed } from "./notebook/events/order-shipped.event";
import { PlaceOrderUseCase } from "./notebook/use-cases/place-order.use-case";

import { ShipOrderUseCase } from "./notebook/use-cases/ship-order.use-case";
import { PgEventStore } from "../src/store/pg.event-store";

import { PrismaClient } from '@prisma/client'
import { AggregateVersionMismatchError } from "../src/error/AggregateVersionMismatchError";
const prisma = new PrismaClient()
const eventStore = PgEventStore

beforeEach(async () => {
    await prisma.eventStore.deleteMany();
    await prisma.outbox.deleteMany();
    await prisma.aggregateVersion.deleteMany();
});

afterEach(async () => {
    await prisma.eventStore.deleteMany();
    await prisma.outbox.deleteMany();
    await prisma.aggregateVersion.deleteMany();
});

describe("Place order use case", () => {
    const order = new Order();
    const placeOrderUseCase = new PlaceOrderUseCase(order, new PlaceOrder('Coffee'), eventStore);

    test("should place order", async () => {
        await placeOrderUseCase.run();
        const history = order.history;
        
        expect(history.length).toBe(1);
        expect(history[0]).toBeInstanceOf(OrderPlaced);
        expect(order.status).toBe('Placed');

    });
});

describe("Ship order use case", () => {
    test('should ship order', async () => {
        const order_setup = new Order();
        const placeOrderUseCase = new PlaceOrderUseCase(order_setup, new PlaceOrder('Coffee'), eventStore);

        await placeOrderUseCase.run();


        const order = new Order();
        const useCase = new ShipOrderUseCase(order, new ShipOrder(order_setup.id, 'New York', order_setup.version as string), eventStore);

        await useCase.run();

        expect(order.history.length).toBe(2);
        expect(order.history[0]).toBeInstanceOf(OrderPlaced);
        expect(order.history[1]).toBeInstanceOf(OrderShipped);
        expect(order.version).not.toBe(order_setup.version);
        expect(order.location).toBe('New York');
        expect(order.status).toBe('Shipped');
    });

    test('should failed to ship order', async () => {
        const order_setup = new Order();
        const placeOrderUseCase = new PlaceOrderUseCase(order_setup, new PlaceOrder('Coffee'), eventStore);

        await placeOrderUseCase.run();


        const order_bad_location = new Order();
        const useCaseBadLocation = new ShipOrderUseCase(order_bad_location, new ShipOrder(order_setup.id, 'EMBARGO', order_setup.version as string), eventStore);

        await useCaseBadLocation.run();

        expect(order_bad_location.history.length).toBe(2);
        expect(order_bad_location.history[0]).toBeInstanceOf(OrderPlaced);
        expect(order_bad_location.history[1]).toBeInstanceOf(OrderShippedFailed);
        expect(order_bad_location.version).not.toBe(order_setup.version);
        expect(order_bad_location.status).toBe('ShippedFailed');

        const order = new Order();
        const useCase = new ShipOrderUseCase(order, new ShipOrder(order_bad_location.id, 'New York', order_bad_location.version as string), eventStore);
        await useCase.run();

        expect(order.history.length).toBe(3);
        expect(order.history[0]).toBeInstanceOf(OrderPlaced);
        expect(order.history[1]).toBeInstanceOf(OrderShippedFailed);
        expect(order.history[2]).toBeInstanceOf(OrderShipped);
        expect(order.version).not.toBe(order_setup.version);
        expect(order.location).toBe('New York');
        expect(order.status).toBe('Shipped');
    });


    test('should throw error when aggregate version mismatch', async () => {
        const order_setup = new Order();
        const placeOrderUseCase = new PlaceOrderUseCase(order_setup, new PlaceOrder('Coffee'), eventStore);

        await placeOrderUseCase.run();

        const order = new Order();
        const useCase = new ShipOrderUseCase(order, new ShipOrder(order_setup.id, 'New York', 'WRONG_VERSION'), eventStore);

        try {
            await useCase.run();
        } catch (e: any) {
            expect(e).toBeInstanceOf(AggregateVersionMismatchError);
        }
    });

});

