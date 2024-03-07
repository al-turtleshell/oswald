import { Hono } from "hono";
import { RegisterRecipeUseCase } from "../specs/cornucopia/recipe/use-cases/register-recipe.use-case";
import { Recipe } from "../specs/cornucopia/recipe/recipe.aggregate";
import { RegisterRecipe } from "../specs/cornucopia/recipe/commands/register-recipe.command";
import { PgEventStore } from "./store/pg.event-store";

const app = new Hono();

app.get('/new-recipe', async (c) => {
    const usecase = new RegisterRecipeUseCase(
        new Recipe(),
        new RegisterRecipe('Caramel'),
        PgEventStore
    );

    await usecase.run();
    return c.json({ message: 'Recipe registered' });
});

const main = async () => {
    Bun.serve({
        fetch: app.fetch,
        port: 3030
    })
}

await main();