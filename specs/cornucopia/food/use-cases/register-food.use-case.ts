import type { EventStore } from "../../../../src/event/event-store";
import { UseCase } from "../../../../src/use-case";
import type { RegisterFood } from "../commands/register-food.command";
import type { Food } from "../food";

class RegisterFoodUseCase extends UseCase {
    constructor(
        aggregate: Food,
        command: RegisterFood,
        eventStore: EventStore
    ) {
        super(aggregate, command, eventStore);
    }
}

export { RegisterFoodUseCase };