import { AggregateRoot } from "../../../src/aggregate";
import type { FoodRegistered } from "./events/food-registered.event";
import { Event } from "../../../src/event/event";
import type { RegisterFood } from "./commands/register-food.command";

class Food extends AggregateRoot {
    private _name: string | null = null;
    private _type: string | null = null;
    constructor() {
        super();
    }

    onFoodRegistered(event: FoodRegistered): void {
        this._id = event.foodId;
        this._name = event.name;
        this._type = event.type;
    }

    async registerFood(command: RegisterFood): Promise<Event> {
        return command.execute();
    }

    get name(): string | null {
        return this._name;
    }

    get type(): string | null {
        return this._type;
    }
}

export { Food };