import { Command } from "../../../../src/command";
import type { Event } from "../../../../src/event/event";
import { v4 as uuid } from 'uuid';
import { RecipeRegistered } from "../events/recipe-registered.event";

class RegisterRecipe extends Command {
    constructor(
        public readonly recipeName: string,
    ) {
        super();
    };

    async execute(): Promise<Event> {
        const recipeId = uuid();

        return new RecipeRegistered(recipeId, this.recipeName);
    }
}

export { RegisterRecipe };