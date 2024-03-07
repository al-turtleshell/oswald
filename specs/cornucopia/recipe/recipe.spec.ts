import { expect, test, describe } from "bun:test";
import { beforeEach, afterEach } from "bun:test";

import { Recipe } from "./recipe.aggregate";
import { RegisterRecipeUseCase } from "./use-cases/register-recipe.use-case";
import { RegisterRecipe } from "./commands/register-recipe.command";
import { RecipeRegistered } from "./events/recipe-registered.event";
import { Food } from "../food/food.aggregate";
import { RegisterFoodUseCase } from "../food/use-cases/register-food.use-case";
import { RegisterFood } from "../food/commands/register-food.command";
import { AddIngredientRecipeUseCase } from "./use-cases/add-ingredient-recipe.use-case";
import { AddIngredient } from "./commands/add-ingredient.command";
import { IngredientAdded, IngredientAddedFailed } from "./events/ingredient-added.event";
import type { EventStore } from "../../../src/event/event-store";
import { loadEventStream } from "../../../src/store/load-event-stream";
import { appendEventsToStream } from "../../../src/store/append-events-to-stream";
import prisma from "../../../prisma/prisma";

const eventStore: EventStore = {
    loadEventStream,
    appendEventsToStream
}

beforeEach(async () => {
    await prisma.eventStore.deleteMany();
    await prisma.outbox.deleteMany();
    await prisma.aggregateVersion.deleteMany();
});

afterEach(async () => {
    await prisma.eventStore.deleteMany();
    await prisma.outbox.deleteMany();
    await prisma.aggregateVersion.deleteMany();
});

describe("Register recipe", () => {
    test('should register recipe', async () => {
        const recipe = new Recipe();
        const registerRecipeUseCase = new RegisterRecipeUseCase(recipe, new RegisterRecipe('Nonna spaghetti'), eventStore);

        await registerRecipeUseCase.run();
        const history = recipe.history;

        expect(history.length).toBe(1);
        expect(history[0]).toBeInstanceOf(RecipeRegistered);
        expect(recipe.name).toBe('Nonna spaghetti'); 
    });
});



describe("Add ingredient", async () => {
    test('should add ingredient', async () => {
        const pasta = new Food();
        const registerPastaUseCase = new RegisterFoodUseCase(pasta, new RegisterFood('Spaghetti', 'Pasta'), eventStore);
        await registerPastaUseCase.run();
    
        const tomato = new Food();
        const registerTomatoUseCase = new RegisterFoodUseCase(tomato, new RegisterFood('Tomato', 'Fruits'), eventStore);
        await registerTomatoUseCase.run();
    
        const start_recipe = new Recipe();
        const registerRecipeUseCase = new RegisterRecipeUseCase(start_recipe, new RegisterRecipe('Nonna spaghetti'), eventStore);
        await registerRecipeUseCase.run();
    
    
        const recipe = new Recipe();
        const addIngredientPastaUseCase = new AddIngredientRecipeUseCase(recipe, new AddIngredient(start_recipe.id, pasta.id, start_recipe.version as string), eventStore);
        await addIngredientPastaUseCase.run();
    
        const history = recipe.history;
        expect(history.length).toBe(2);
        expect(history[1]).toBeInstanceOf(IngredientAdded);
        expect(recipe.ingredients[0].food.name).toBe('Spaghetti');
        
        const recipe01 = new Recipe();
        const addIngredientTomatoUseCase = new AddIngredientRecipeUseCase(recipe01, new AddIngredient(recipe.id, tomato.id, recipe.version as string), eventStore);
        await addIngredientTomatoUseCase.run();

        const history01 = recipe01.history;
        expect(history01.length).toBe(3);
        expect(history01[2]).toBeInstanceOf(IngredientAdded);
        expect(recipe01.ingredients[1].food.name).toBe('Tomato');
    });

    test('should failed to add ingredient', async () => {
        const pasta = new Food();
        const registerPastaUseCase = new RegisterFoodUseCase(pasta, new RegisterFood('Spaghetti', 'Pasta'), eventStore);
        await registerPastaUseCase.run();
    
        const tomato = new Food();
        const registerTomatoUseCase = new RegisterFoodUseCase(tomato, new RegisterFood('Tomato', 'Fruits'), eventStore);
        await registerTomatoUseCase.run();
    
        const start_recipe = new Recipe();
        const registerRecipeUseCase = new RegisterRecipeUseCase(start_recipe, new RegisterRecipe('Nonna spaghetti'), eventStore);
        await registerRecipeUseCase.run();
    
    
        const recipe = new Recipe();
        const addIngredientPastaUseCase = new AddIngredientRecipeUseCase(recipe, new AddIngredient(start_recipe.id, pasta.id, start_recipe.version as string), eventStore);
        await addIngredientPastaUseCase.run();
    
        const history = recipe.history;
        expect(history.length).toBe(2);
        expect(history[1]).toBeInstanceOf(IngredientAdded);
        expect(recipe.ingredients[0].food.name).toBe('Spaghetti');
        
        const recipe01 = new Recipe();
        const addIngredientTomatoUseCase = new AddIngredientRecipeUseCase(recipe01, new AddIngredient(recipe.id, pasta.id, recipe.version as string), eventStore);
        await addIngredientTomatoUseCase.run();

        const history01 = recipe01.history;
        expect(history01.length).toBe(3);
        expect(history01[2]).toBeInstanceOf(IngredientAddedFailed);
        
    });
});