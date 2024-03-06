import { AggregateRoot } from "../../../src/aggregate";
import type { RegisterRecipe } from "./commands/register-recipe.command";
import type { RecipeRegistered } from "./events/recipe-registered.event";
import { Event } from "../../../src/event/event";
import { IngredientAddedFailed, type IngredientAdded } from "./events/ingredient-added.event";
import { Food } from "../food/food";

import type { AddIngredient } from "./commands/add-ingredient.command";

class Recipe extends AggregateRoot {
    private _name: string | null = null;
    private _ingredients: { food: Food }[] = [];

    constructor() {
        super();
   
    }

    onRecipeRegistered(event: RecipeRegistered): void {
        this._id = event.recipeId;
        this._name = event.name;
    }

    async onIngredientAdded(event: IngredientAdded): Promise<void> {
        const food = await this.rehydrateEntity(new Food(), event.foodId);
        this._ingredients.push({food});
    }

    async registerRecipe(command: RegisterRecipe): Promise<Event> {
        return await command.execute();
    }

    async addIngredient(command: AddIngredient): Promise<Event> {

        if (this._ingredients.some(v => v.food.id === command.foodId)) {
            return new IngredientAddedFailed('Ingredient already in this recipe');
        }

        return await command.execute();
    }

    get name(): string | null {
        return this._name;
    }

    get ingredients(): { food: Food }[] {
        return this._ingredients;
    }
}

export {Recipe}