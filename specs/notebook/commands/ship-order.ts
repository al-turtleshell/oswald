import { Command } from "../../../src/command";
import { OrderShipped } from "../events/order-shipped.event";
import { Event } from "../../../src/event/event";

class ShipOrder extends Command {
    constructor(
        public readonly orderId: string,
        public readonly location: string,
        public readonly aggregateVersion: string
    ) {

        super(orderId, aggregateVersion);
    }

    async execute(): Promise<Event> {
        return new OrderShipped(this.orderId, this.location);
    }

}

export { ShipOrder };