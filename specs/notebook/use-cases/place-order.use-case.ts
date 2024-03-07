import type { EventStore } from "../../../src/event/event-store";
import { UseCase } from "../../../src/use-case";
import type { PlaceOrder } from "../commands/place-order";
import type { Order } from "../order.aggregate";

class PlaceOrderUseCase extends UseCase {
    constructor(
        aggregate: Order,
        command: PlaceOrder,
        eventStore: EventStore
    ) {
        super(aggregate, command, eventStore);
    }
}

export { PlaceOrderUseCase};