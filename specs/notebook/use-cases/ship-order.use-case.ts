import type { EventStore } from "../../../src/event/event-store";
import { UseCase } from "../../../src/use-case";
import type { ShipOrder } from "../commands/ship-order";
import type { Order } from "../order";

class ShipOrderUseCase extends UseCase {
    constructor(
        aggregate: Order,
        command: ShipOrder,
        eventStore: EventStore
    ) {
        super(aggregate, command, eventStore);
    }
}

export { ShipOrderUseCase};