import { Event, EventFailed } from "../../../src/event/event";


class OrderShipped extends Event {
    constructor(
        public readonly orderId: string,
        public readonly location: string,
    ) {
        super();
    }
}

class OrderShippedFailed extends EventFailed {
    constructor(public readonly orderId: string, reason: string) {
        super(reason);
    }
}

export {OrderShipped, OrderShippedFailed};


