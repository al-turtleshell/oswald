import { expect, test, describe } from "bun:test";
import { beforeEach, afterEach } from "bun:test";
import { Food } from "./food.aggregate";
import { PrismaClient } from '@prisma/client'
import { PgEventStore } from "../../../src/store/pg.event-store";
import { RegisterFoodUseCase } from "./use-cases/register-food.use-case";
import { RegisterFood } from "./commands/register-food.command";
import { FoodRegistered } from "./events/food-registered.event";
import { CommandValidationError } from "../../../src/error/CommandValidationError";


const prisma = new PrismaClient()
const eventStore = PgEventStore

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

describe("Register food", () => {
    test('should register food', async () => {
        const food = new Food();
        const registerFoodUseCase = new RegisterFoodUseCase(food, new RegisterFood('Coffee', 'grains'), eventStore);

        await registerFoodUseCase.run();
        const history = food.history;

        expect(history.length).toBe(1);
        expect(history[0]).toBeInstanceOf(FoodRegistered);
        expect(food.name).toBe('Coffee'); 
        expect(food.type).toBe('grains');
    });

    test('should not register food with same name', async () => {
        try {        
            const food = new Food();
            const registerFoodUseCase = new RegisterFoodUseCase(food, new RegisterFood('Tea', 'grains'), eventStore);
    
            await registerFoodUseCase.run();
    
            const food01 = new Food();

            const registerFoodUseCase01 = new RegisterFoodUseCase(food01, new RegisterFood('Tea', 'grains'), eventStore);
            await registerFoodUseCase01.run();
        } catch (e: any) {
            expect(e).toBeInstanceOf(CommandValidationError);
        }
    });
});