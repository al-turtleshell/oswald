import { AggregateRoot } from "../../src/aggregate";
import type { Command } from "../../src/command";
import { OrderPlaced, OrderPlacedFailed } from "./events/order-placed.event";
import { Event } from "../../src/event/event";
import { OrderShipped, OrderShippedFailed } from "./events/order-shipped.event";
import type { ShipOrder } from "./commands/ship-order";



class Order extends AggregateRoot {
    
    private _status: string | null = null;
    private _location: string | null = null;

    constructor() {
        super();
    }

    onOrderPlaced(event: OrderPlaced): void {
        this._id = event.orderId;
        this._status = "Placed";
    }

    onOrderShipped(event: OrderShipped): void {
        this._status = "Shipped";
        this._location = event.location;
    }

    onOrderShippedFailed(event: OrderShippedFailed): void {
        this._status = "ShippedFailed";
    }

    async placeOrder(command: Command): Promise<Event> {
        return await command.execute();
    }


    async shipOrder(command: ShipOrder): Promise<Event> {
        if (command.location === 'EMBARGO') {
            return new OrderShippedFailed(this._id as string,'Location is forbidden');
        }

        return await command.execute();
    }

    get status(): string | null {
        return this._status;
    }

    get location(): string | null {
        return this._location;
    }
}

export { Order };


// function BeforeMethod(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
//     try {
//         // Save a reference to the original method
//         const originalMethod = descriptor.value;
//         const instance = target as AggregateRoot;

//         instance.id;

//         // console.log(target);
//         // console.log(propertyKey);
//         // console.log(descriptor);

//         // Replace the original method with a new function that calls
//         // the original method plus some additional behavior
//         descriptor.value = function(...args: any[]) {
//             console.log(`Before ${propertyKey} method is called`);

//             // Call the original method
//             return originalMethod.apply(this, args);
//         };
//     } catch (e) {
//         console.log(e);
//     }
    
// }