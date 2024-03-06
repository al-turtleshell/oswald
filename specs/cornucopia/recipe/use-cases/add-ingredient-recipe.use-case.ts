import { UseCase } from "../../../../src/use-case";
import type { Recipe } from "../recipe";
import type { EventStore } from "../../../../src/event/event-store";

import type { AddIngredient } from "../commands/add-ingredient.command";

class AddIngredientRecipeUseCase extends UseCase {
    constructor(
        aggregate: Recipe,
        command: AddIngredient,
        eventStore: EventStore
    ) {
        super(aggregate, command, eventStore);
    }
}

export { AddIngredientRecipeUseCase };