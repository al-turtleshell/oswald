import { Command } from "../../../../src/command";
import type { Event } from "../../../../src/event/event";

import { IngredientAdded } from "../events/ingredient-added.event";

class AddIngredient extends Command {
    constructor(
        public readonly recipeId: string,
        public readonly foodId: string,
        public readonly aggregateVersion: string
    ) {
        super(recipeId, aggregateVersion);
    };

    async execute(): Promise<Event> {
        return new IngredientAdded(this.recipeId, this.foodId);
    }
}

export { AddIngredient };