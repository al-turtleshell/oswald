import { UseCase } from "../../../../src/use-case";
import type { Recipe } from "../recipe.aggregate";
import type { EventStore } from "../../../../src/event/event-store";
import type { RegisterRecipe } from "../commands/register-recipe.command";

class RegisterRecipeUseCase extends UseCase {
    constructor(
        aggregate: Recipe,
        command: RegisterRecipe,
        eventStore: EventStore
    ) {
        super(aggregate, command, eventStore);
    }
}

export { RegisterRecipeUseCase };