import { Event, EventFailed } from "../../../../src/event/event";

class IngredientAdded extends Event {
    constructor(
        public readonly recipeId: string,
        public readonly foodId: string,
    ) {
        super();
    }
}

class IngredientAddedFailed extends EventFailed {}

export {IngredientAdded, IngredientAddedFailed};