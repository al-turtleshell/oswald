import { Event, EventFailed } from "../../../../src/event/event";

class FoodRegistered extends Event {
    constructor(
        public readonly foodId: string,
        public readonly name: string,
        public readonly type: string,
    ) {
        super();
    }
}

class FoodRegisteredFailed extends EventFailed {}

export {FoodRegistered, FoodRegisteredFailed};