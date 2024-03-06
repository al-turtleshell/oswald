import { Command } from "../../../src/command";
import { CommandValidationError } from "../../../src/error/CommandValidationError";
import { Event } from "../../../src/event/event";
import { OrderPlaced } from "../events/order-placed.event";
import { v4 as uuid } from 'uuid';

class PlaceOrder extends Command {
    constructor(
        public readonly orderType: string,
    ) {
        super();
    }

    async execute(): Promise<Event> {
        // call external API to reserve a slot
        const orderId = uuid();
        
        return new OrderPlaced(orderId, this.orderType);
        //return new OrderPlacedFailed('Order not available');
    }
    
}

export { PlaceOrder };