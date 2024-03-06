import { Event, EventFailed } from "../../../src/event/event";

class OrderPlaced extends Event {
    constructor(
        public readonly orderId: string,
        public readonly orderType: string,
    ) {
        super();
    }
}

class OrderPlacedFailed extends EventFailed {
    constructor(public readonly orderId: string | null, reason: string) {
    super(reason);
  }
}

export {OrderPlaced, OrderPlacedFailed};