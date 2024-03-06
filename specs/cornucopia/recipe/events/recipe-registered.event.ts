import { Event, EventFailed } from "../../../../src/event/event";

class RecipeRegistered extends Event {
    constructor(
        public readonly recipeId: string,
        public readonly name: string,
    ) {
        super();
    }
}

class RecipeRegisteredFailed extends EventFailed {}

export {RecipeRegistered, RecipeRegisteredFailed};