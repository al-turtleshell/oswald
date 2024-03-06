import { IngredientAdded, IngredientAddedFailed } from "../../specs/cornucopia/recipe/events/ingredient-added.event";
import { RecipeRegistered, RecipeRegisteredFailed } from "../../specs/cornucopia/recipe/events/recipe-registered.event";
import { FoodRegistered, FoodRegisteredFailed } from "../../specs/cornucopia/food/events/food-registered.event";
import { OrderPlaced, OrderPlacedFailed } from "../../specs/notebook/events/order-placed.event";
import { OrderShipped, OrderShippedFailed } from "../../specs/notebook/events/order-shipped.event";

const eventClassRegistry: Record<string, unknown> = {
    "IngredientAdded": IngredientAdded,
    "IngredientAddedFailed": IngredientAddedFailed,
    "RecipeRegistered": RecipeRegistered,
    "RecipeRegisteredFailed": RecipeRegisteredFailed,
    "FoodRegistered": FoodRegistered,
    "FoodRegisteredFailed": FoodRegisteredFailed,
    "OrderPlaced": OrderPlaced,
    "OrderPlacedFailed": OrderPlacedFailed,
    "OrderShipped": OrderShipped,
    "OrderShippedFailed": OrderShippedFailed,
};

export { eventClassRegistry };